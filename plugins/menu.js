const os = require('os')
const { runtime, formatp, tiny, bot } = require('../lib')
const config = require('../config')
const os = require('os')
const fs = require('fs')
const Config = require('../config')
const { fancytext, runtime, formatp, prefix, bot } = require('../lib')
const longCharacter = String.fromCharCode(8206)
const readMoreSeparator = longCharacter.repeat(4001)
const cron = require('node-cron')

global.caption = global.caption || Config.caption || 'αѕтα-м∂ 2024'
global.ownerName = global.ownerName || Config.ownerName || 'αѕтяσ'
global.botName = global.botName || Config.botName || 'αѕтα-м∂'
global.menuOption = global.menuOption || Config.menu || ''
global.commandPrefix = global.commandPrefix || Config.HANDLERS || prefix || '^'
global.menuStyle = global.menuStyle || process.env.MENU_STYLE || 'ss'
global.uiCache = {}
global.uiUrls = []
let cronStarted = false

if (!cronStarted) {
 cron.schedule('*/15 * * * *', () => {
  cronStarted = true
  fs.readdir('./temp', (err, files) => {
   if (err) return
   files.forEach((file) => {
    try {
     fs.unlinkSync(`./temp/${file}`)
    } catch (e) {
     console.log('Error deleting files:', e)
    }
   })
  })
 })
}

async function createUserInterface() {
 if (!global.userImages || /text|txt|nothing/.test(global.userImages)) {
  return {}
 }
 const imageFormats = ['.jpg', '.jpeg', '.png', '.webp']
 const videoFormats = ['.mp4', '.avi', '.mov', '.mkv', '.gif', '.m4v']
 if (!uiUrls || !uiUrls[0]) {
  uiUrls = global.userImages ? global.userImages.split(',') : ['']
  uiUrls = uiUrls.filter((url) => url.trim() !== '')
 }
 const selectedUrl = (uiUrls[Math.floor(Math.random() * uiUrls.length)] || '').trim()
 if (/http/gi.test(selectedUrl) && !uiCache[selectedUrl]) {
  const fileExtension = selectedUrl.substring(selectedUrl.lastIndexOf('.')).toLowerCase()
  if (imageFormats.includes(fileExtension)) {
   uiCache[selectedUrl] = 'image'
  } else if (videoFormats.includes(fileExtension)) {
   uiCache[selectedUrl] = 'video'
  }
 }
 return {
  [uiCache[selectedUrl] || 'Invalid_Type_URL']: {
   url: selectedUrl,
  },
 }
}

async function createButtons(inputMessage) {
 if (!inputMessage || Array.isArray(inputMessage)) {
  return inputMessage || []
 }
 const buttonRegex = /#button\s*:\s*([^|]+)\s*\|\s*display_text\s*:\s*([^|]+)(?:\s*\|\s*(id)\s*:\s*([^|]+))?(?:\s*\|\s*(copy_code)\s*:\s*([^|]+))?\/#/gi
 const buttonsArray = []
 let buttonMatch
 while ((buttonMatch = buttonRegex.exec(inputMessage)) !== null) {
  try {
   const buttonType = buttonMatch[1].trim()
   const displayText = buttonMatch[2].trim()
   const buttonId = buttonMatch[4] ? buttonMatch[4].trim() : ''
   const copyCode = buttonMatch[6] ? buttonMatch[6].trim() : ''
   let buttonObject = { display_text: displayText }

   if (buttonType === 'cta_copy') {
    buttonObject = { display_text: displayText, id: buttonId, copy_code: copyCode }
   } else if (buttonType === 'cta_url') {
    buttonObject = {
     display_text: displayText,
     url: (buttonId || '').replace(' /#', '').trim(),
     merchant_url: copyCode || 'https://www.google.com',
    }
   } else {
    buttonObject = { display_text: displayText, id: buttonId }
   }

   if (buttonType) {
    buttonsArray.push({
     name: buttonType,
     buttonParamsJson: JSON.stringify(buttonObject),
    })
   } else {
    console.log('Button name missing in', buttonMatch[0])
   }
  } catch (error) {
   console.log(error)
  }
 }
 return buttonsArray || []
}

async function sendButtons(message, context = {}, messageBody = [], customJid = false) {
 if (!message) {
  throw 'Message instance is required.'
 }
 const recipientJid = customJid || message.jid
 if (typeof context !== 'object') {
  context = {}
 }
 context.messageId = context.messageId || message.bot.messageId()
 if (typeof messageBody === 'string') {
  messageBody = createButtons(messageBody)
 }
 if (typeof context.buttons === 'string' || Array.isArray(context.buttons)) {
  messageBody = [...messageBody, ...(createButtons(context.buttons) || [])]
 }
 const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys')
 let mediaMessageData = {}
 try {
  if (typeof context.imageMessage === 'object') {
   mediaMessageData = { imageMessage: context.imageMessage }
  } else if (typeof context.videoMessage === 'object') {
   mediaMessageData = { videoMessage: context.videoMessage }
  } else {
   let mediaMessage = false
   const mediaContext = context.image || context.video ? context : createUserInterface()
   if (mediaContext.image) {
    mediaMessage = (await prepareWAMessageMedia({ image: mediaContext.image || null }, { upload: message.bot.waUploadToServer })) || false
   } else if (mediaContext.video) {
    mediaMessage = (await prepareWAMessageMedia({ video: mediaContext.video || null }, { upload: message.bot.waUploadToServer })) || false
   }
   if (mediaMessage) {
    mediaMessageData = mediaMessage.imageMessage ? { imageMessage: mediaMessage.imageMessage } : mediaMessage.videoMessage ? { videoMessage: mediaMessage.videoMessage } : {}
   }
  }
 } catch (error) {
  mediaMessageData = {}
 }
 const enhancedContext = {
  ...(await message.bot.contextInfo(botName, message.senderName || ownerName)),
  ...(context.contextInfo || {}),
 }
 const formattedMessage = generateWAMessageFromContent(
  recipientJid,
  {
   viewOnceMessage: {
    message: {
     interactiveMessage: proto.Message.InteractiveMessage.create({
      body: { text: context.text || context.body || context.caption || 'Astro' },
      footer: { text: context.footer || 'αѕтα тє¢н тєαм' },
      header: {
       ...(mediaMessageData || {}),
       hasMediaAttachment: mediaMessageData.imageMessage || mediaMessageData.videoMessage ? true : false,
       ...(context.header || {}),
      },
      contextInfo: enhancedContext,
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
       buttons: messageBody,
      }),
     }),
     messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
     },
    },
   },
  },
  context
 )
 await message.bot.relayMessage(recipientJid, formattedMessage.message, { messageId: context.messageId })
 return formattedMessage
}
bot(
 {
  pattern: 'menu',
  desc: 'Show All Commands',
  dontAddCommandList: true,
 },
 async (message, input) => {
  try {
   const { commands } = require('../lib')
   const categorizedCommands = {}
   commands.forEach((command) => {
    if (command.dontAddCommandList === false && command.pattern !== undefined) {
     if (!categorizedCommands[command.category]) {
      categorizedCommands[command.category] = []
     }
     categorizedCommands[command.category].push(command.pattern)
    }
   })

   const currentTime = message.time
   const currentDate = message.date
   const currentUser = message.pushName
   let menuText = `
╭───「 ${config.botname || 'xᴘᴏ ᴍᴅ'} 」
┃╭──────────────
┃│ ᴜsᴇʀ : ${currentUser}
┃│ ᴛɪᴍᴇ : ${currentTime}
┃│ ᴅᴀᴛᴇ : ${currentDate}
┃│ ʀᴀᴍ  : ${formatp(os.totalmem() - os.freemem())}
┃│ ᴜᴘᴛɪᴍᴇ : ${runtime(process.uptime())}
┃│ ᴘʟᴀᴛғᴏʀᴍ: ${os.platform()}
┃│ ᴘʟᴜɢɪɴs : ${commands.length}
┃╰──────────────
╰═══════════════⊷
\t *ᴠᴇʀsɪᴏɴ 𝟷.𝟶*
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
   const messageOptions = {
    caption: menuText,
   }

   return await sendButtons(message.chat, messageOptions)
  } catch (error) {
   await message.error(`${error}\nCommand: menu`, error)
  }
 }
)
