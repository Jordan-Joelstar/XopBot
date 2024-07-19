const os = require('os')
const fs = require('fs').promises
const path = require('path')
const cron = require('node-cron')
const { runtime, formatp, tiny, prefix } = require('.')
const Config = require('../config')
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys')

const BUTTONS = process.env.BUTTONS || process.env.MENU_BTN || '1'
const caption = process.env.CAPTION || Config.caption || 'αѕтα-м∂ 2024'
const ownername = Config.ownername || 'αѕтяσ'
const botname = Config.botname || 'αѕтα-м∂'

let ui_urls = []

const initFormat = ['.jpg', '.jpeg', '.png', '.webp']
const rcnFormat = ['.mp4', '.avi', '.mov', '.mkv', '.gif', '.m4v']

const setupCronJob = () => {
 cron.schedule('*/15 * * * *', async () => {
  try {
   const files = await fs.readdir('./temp')
   for (const file of files) {
    await fs.unlink(path.join('./temp', file))
   }
  } catch (error) {
   console.error('ERROR DELETING FILES:', error)
  }
 })
}

const create_UI = () => {
 if (!global.userImages || /text|txt|nothing/.test(global.userImages)) {
  return {}
 }

 if (!ui_urls.length) {
  ui_urls = global.userImages ? global.userImages.split(',').filter((url) => url.trim() !== '') : []
 }

 const randomUrl = ui_urls[Math.floor(Math.random() * ui_urls.length)] || ''
 const fileExtension = path.extname(randomUrl).toLowerCase()

 let mediaType = 'Invalid_Type_URL'
 if (initFormat.includes(fileExtension)) {
  mediaType = 'image'
 } else if (rcnFormat.includes(fileExtension)) {
  mediaType = 'video'
 }

 return {
  [mediaType]: { url: randomUrl },
 }
}

const createButtons = (onMessage) => {
 if (!onMessage || Array.isArray(onMessage)) {
  return onMessage || []
 }

 const btnRegex = /#button\s*:\s*([^|]+)\s*\|\s*display_text\s*:\s*([^|]+)(?:\s*\|\s*(id)\s*:\s*([^|]+))?(?:\s*\|\s*(copy_code)\s*:\s*([^|]+))?\/#/gi
 const buttons = []

 let match
 while ((match = btnRegex.exec(onMessage)) !== null) {
  try {
   const [, buttonType, displayText, , id, , copyCode] = match
   let buttonData = { display_text: displayText.trim() }

   switch (buttonType.trim()) {
    case 'cta_copy':
     buttonData = { ...buttonData, id: id?.trim(), copy_code: copyCode?.trim() }
     break
    case 'cta_url':
     buttonData = {
      ...buttonData,
      url: (id || '').replace(' /#', '').trim(),
      merchant_url: copyCode?.trim() || 'https://www.google.com',
     }
     break
    default:
     buttonData = { ...buttonData, id: id?.trim() }
   }

   buttons.push({
    name: buttonType.trim(),
    buttonParamsJson: JSON.stringify(buttonData),
   })
  } catch (error) {
   console.error('Error creating button:', error)
  }
 }

 return buttons
}

const sendButtons = async (message, context = {}, messageBody = [], onBodyBtn = false) => {
 if (!message) {
  throw new Error('Need message instance')
 }

 const btnJid = onBodyBtn || message.jid
 context.messageId = context.messageId || message.bot.messageId()

 const buttons = Array.isArray(messageBody) ? messageBody : createButtons(messageBody)
 if (typeof context.buttons === 'string' || Array.isArray(context.buttons)) {
  buttons.push(...createButtons(context.buttons))
 }

 let mediaMessage = {}
 try {
  if (context.imageMessage || context.videoMessage) {
   mediaMessage = context.imageMessage ? { imageMessage: context.imageMessage } : { videoMessage: context.videoMessage }
  } else {
   const mediaData = context.image || context.video ? context : create_UI()
   const preparedMedia = await prepareWAMessageMedia(mediaData.image ? { image: mediaData.image } : { video: mediaData.video }, { upload: message.bot.waUploadToServer })
   mediaMessage = preparedMedia.imageMessage ? { imageMessage: preparedMedia.imageMessage } : preparedMedia.videoMessage ? { videoMessage: preparedMedia.videoMessage } : {}
  }
 } catch (error) {
  console.error('Error preparing media:', error)
 }

 const contextInfo = {
  ...(await message.bot.contextInfo(botname, message.senderName || ownername)),
  ...(context.contextInfo || {}),
 }

 const interactiveMessage = proto.Message.InteractiveMessage.create({
  body: { text: context.text || context.body || context.caption || 'xᴘᴏ' },
  footer: { text: context.footer || 'ʀᴇʟᴇᴀsᴇ ᴠ𝟽' },
  header: {
   ...mediaMessage,
   hasMediaAttachment: !!mediaMessage.imageMessage || !!mediaMessage.videoMessage,
   ...(context.header || {}),
  },
  contextInfo: contextInfo,
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
   buttons: buttons,
  }),
 })

 const generatedMessage = generateWAMessageFromContent(btnJid, { viewOnceMessage: { message: { interactiveMessage } } }, context)

 await message.bot.relayMessage(btnJid, generatedMessage.message, { messageId: context.messageId })
 return generatedMessage
}

const handleMenuCommand = async (message, input, match) => {
 try {
  const { commands } = require('.')
  const categorizedCommands = {}
  commands.forEach((cmd) => {
   if (cmd.dontAddCommandList === false && cmd.pattern !== undefined) {
    if (!categorizedCommands[cmd.category]) {
     categorizedCommands[cmd.category] = []
    }
    categorizedCommands[cmd.category].push(cmd.pattern)
   }
  })
  const currentTime = message.time
  const currentDate = message.date
  const currentUser = message.pushName
  let menuText = `╭═════ ${botname} ═══┈⊷
┃╭──────────────
┃│ ᴜsᴇʀ : ${currentUser}
┃│ ᴛɪᴍᴇ : ${currentTime}
┃│ ᴅᴀᴛᴇ : ${currentDate}
┃│ ʀᴀᴍ  : ${formatp(os.totalmem() - os.freemem())}
┃│ ᴜᴘᴛɪᴍᴇ : ${runtime(process.uptime())}
┃│ ᴘʟᴀᴛғᴏʀᴍ: ${os.platform()}
┃│ ᴘʟᴜɢɪɴs : ${commands.length}
┃╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
\t *ʀᴇʟᴇᴀsᴇ ᴠ𝟽*
 ${'\u200b'.repeat(4001)}
`

  // Append commands to the menu text
  for (const category in categorizedCommands) {
   menuText += `
「 *${tiny(category)}* 」\n`

   for (const command of categorizedCommands[category]) {
    menuText += `││◦ ${tiny(command, 1)}\n`
   }

   menuText += `│╰────────────┈⊷\n╰─────────────┈⊷\n`

   // If input matches the category, break after appending its commands
   if (input.toLowerCase() === category.toLowerCase()) {
    break
   }
  }

  menuText += caption

  const messageContent = { caption: menuText }

  if (/1|buttons|btn/gi.test(BUTTONS) && message.device !== 'web') {
   await sendButtons(message, {
    caption: menuText,
    buttons: `
 #button:quick_reply | display_text : Server| id: ${prefix}menu /# 
 #button:cta_location| display_text : Script | id:${prefix}repo /#            
 #button:cta_url | display_text : About | id:${prefix}list /#        
        `,
   })
  } else {
   await message.sendUi(message.chat, messageContent, message)
  }
 } catch (error) {
  await message.error(`${error}\nCommand: menu`, error)
 }
}

module.exports = {
 setupCronJob,
 create_UI,
 createButtons,
 sendButtons,
 handleMenuCommand,
}
