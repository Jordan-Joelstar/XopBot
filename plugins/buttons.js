const os = require('os')
const fs = require('fs').promises
const path = require('path')
const cron = require('node-cron')
const { fancytext, runtime, formatp } = require('../lib')
const Config = require('../config')
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys')

const BUTTONS = process.env.BUTTONS || process.env.MENU_BTN || '1'
const caption = process.env.CAPTION || Config.caption || 'αѕтα-м∂ 2024'
const ownername = Config.ownername || 'αѕтяσ'
const botname = Config.botname || 'αѕтα-м∂'
const HANDLERS = Config.HANDLERS || '^'
const menu_fancy = process.env.MENU_FANCY || 'ss'

let ui_Cache = {}
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
  body: { text: context.text || context.body || context.caption || 'Astro' },
  footer: { text: context.footer || 'αѕтα тє¢н тєαм' },
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

const handleMenuCommand = async (message, match) => {
 try {
  const { commands } = require('../lib')

  const menuStyles = {
   1: {
    topHeader: `╭━━━〔 *${botname}* 〕━━━┈⊷`,
    sideHeader: '┃✵│',
    topFooter: '┃✵╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷',
    categoryStart: '╭─────────────┈⊷\n│「',
    categoryEnd: '」\n╰┬────────────┈⊷',
    cmdLine: '││◦➛',
    categoryFullEnd: '│╰────────────┈⊷\n╰─────────────┈⊷',
   },
   2: {
    topHeader: `╭═══ *${botname}*  ═══⊷\n┃❃╭──────────────`,
    sideHeader: '┃❃│',
    topFooter: '┃❃╰───────────────\n╰═════════════════⊷',
    categoryStart: '╭─❏',
    categoryEnd: '❏',
    cmdLine: '┃❃│',
    categoryFullEnd: '┃❃╰───────────────\n╰═════════════════⊷',
   },
   3: {
    topHeader: `╭═══〘  ${botname}  〙═══⊷❍\n┃✰╭──────────────`,
    sideHeader: '┃✰│',
    topFooter: '┃✰╰───────────────\n╰═════════════════⊷',
    categoryStart: '╭════〘',
    categoryEnd: '〙════⊷❍',
    cmdLine: '┃✰│',
    categoryFullEnd: '┃✰╰─────────────────❍\n╰══════════════════⊷❍',
   },
  }

  const menuType = menu === '' ? Math.floor(Math.random() * 3) + 1 : menu.trim().startsWith('1') || menu.toLowerCase().includes('v1') ? 1 : menu.trim().startsWith('2') || menu.toLowerCase().includes('v2') ? 2 : 3

  const style = menuStyles[menuType]

  const cmdlets = {}
  commands.forEach((cmd) => {
   if (cmd.dontAddCommandList === false && cmd.pattern !== undefined) {
    if (!cmdlets[cmd.category]) {
     cmdlets[cmd.category] = []
    }
    cmdlets[cmd.category].push(cmd.pattern)
   }
  })

  const menuFancys = [1, 22, 23, 1, 36, 35, 48, 1, 42, 55, 56]
  const text = parseInt(menu_fancy) || menuFancys[Math.floor(Math.random() * menuFancys.length)]

  let menuText = `${style.topHeader}
${style.sideHeader} ＵＳＥＲ:- ${ownername}
${style.sideHeader} ＭＯＤＥ:- ${Config.WORKTYPE}
${style.sideHeader} ＣＭＤＳ:- ${commands.length}
${style.sideHeader} ＡＬＩＶＥ:- ${runtime(process.uptime())}
${style.sideHeader} ＲＡＭ:- ${formatp(os.totalmem() - os.freemem())}
${style.sideHeader} ＴＩＭＥ:- ${message.time}
${style.topFooter}
\t\`\`\`❑ ᴘᴀᴛᴄʜ 𝟹.𝟻.𝟶 ❑\`\`\`
 ${'\u200b'.repeat(4001)}
`

  for (const category in cmdlets) {
   if (match.toLowerCase() === category.toLowerCase()) {
    menuText = `${style.categoryStart} *${fancytext(category, text)}* ${style.categoryEnd}\n`
    for (const cmd of cmdlets[category]) {
     menuText += `${style.cmdLine} ${fancytext(cmd, text)}\n`
    }
    menuText += `${style.categoryFullEnd}\n`
    break
   } else {
    menuText += `${style.categoryStart} *${fancytext(category, text)}* ${style.categoryEnd}\n`
    for (const cmd of cmdlets[category]) {
     menuText += `${style.cmdLine} ${fancytext(cmd, text)}\n`
    }
    menuText += `${style.categoryFullEnd}\n`
   }
  }

  menuText += caption

  const messageContent = { caption: menuText }

  if (/1|buttons|btn/gi.test(BUTTONS) && message.device !== 'web') {
   await sendButtons(message, {
    caption: menuText,
    buttons: `
          #button:cta_url | display_text : Get Your Own| id:${Config.github} /# 
          #button:cta_url | display_text : Support| id:${Config.SupportGc} /# 
          #button:cta_url | display_text : Channel | id:${Config.ChannelLink} /#            
          #button:cta_url | display_text : Full Support | id:${Config.tglink} /#            
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
