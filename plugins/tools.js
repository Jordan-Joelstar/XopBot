const util = require('util')
const fs = require('fs-extra')
const { formatp, bot, prefix, runtime, Config, parsedJid, sleep, createUrl, getDateTime } = require('../lib')
const axios = require('axios')
const os = require('os')
bot(
 {
  pattern: 'readmore',
  info: 'Creates readmore text.',
  type: 'tools',
 },
 async (message, text) => {
  try {
   const replyText = text || message.reply_text || '_Provide Text, Text2_'
   const readmore = String.fromCharCode(8206).repeat(4001)
   const updatedText = replyText.includes('readmore') ? replyText.replace(/readmore/, readmore) : replyText + readmore

   await message.reply(updatedText)
  } catch (error) {
   await message.error(`${error}\n\ncommand : readmore`, error, false)
  }
 }
)

const pmtypes = ['videoMessage', 'imageMessage']

const handleMediaToUrl = async (context, createUrlFn, errorMsg) => {
 try {
  const mediaMessage = pmtypes.includes(context.mtype) ? context : context.reply_message
  if (!mediaMessage || !pmtypes.includes(mediaMessage?.mtype)) {
   return context.reply('*Reply Image/Video*')
  }

  const mediaPath = await context.bot.downloadAndSaveMediaMessage(mediaMessage)
  const urlData = await createUrlFn(mediaPath)

  if (!urlData || !urlData.url) {
   return context.reply(errorMsg)
  }

  try {
   fs.unlink(mediaPath)
  } catch {}

  await context.send(util.format(urlData.url), {}, 'asta', mediaMessage)
 } catch (error) {
  await context.error(`${error}\n\ncommand : ${context.pattern}`, error)
 }
}

bot(
 {
  pattern: 'url',
  info: 'Url from image/video',
  type: 'tools',
 },
 (context) => handleMediaToUrl(context, createUrl, '*_Failed To Create Url!_*')
)

bot(
 {
  pattern: 'upload',
  info: 'uploads image/video',
  type: 'tools',
 },
 (context) => handleMediaToUrl(context, (path) => createUrl(path, 'uguMashi'), '*_Failed To Create Url!_*')
)

bot(
 {
  pattern: 'calc',
  info: 'Calculate an equation.',
  type: 'tools',
 },
 async (message, equation) => {
  try {
   if (!equation) {
    return await message.reply('*Please enter a math operation*\n*Example: .calc 22+12*')
   }

   const sanitizedEquation = equation.replace(/\s+/g, '')
   if (!/^(\d+([-+%*/]\d+)+)$/.test(sanitizedEquation)) {
    return await message.reply('Please enter a valid mathematical operation.')
   }

   if (sanitizedEquation.includes('/') && sanitizedEquation.split('/').some((part) => part === '0')) {
    return message.reply('Cannot divide by zero.')
   }

   const calculate = (expr) => new Function('return ' + expr)()
   const result = calculate(sanitizedEquation)
   const parts = sanitizedEquation.match(/\d+|[-+%*/]/g)

   if (parts.length === 3) {
    const [num1, operator, num2] = parts
    return await message.reply(`${num1} ${operator} ${num2} = ${result}`)
   } else {
    return await message.reply(`Result: ${result}`)
   }
  } catch (error) {
   return await message.error(`${error}\n\ncommand: calc`, error)
  }
 }
)

bot(
 {
  pattern: 'repo',
  info: 'Sends info about repo',
  type: 'tools',
 },
 async (message) => {
  try {
   const { data } = await axios.get('https://api.github.com/repos/AstroAnalytics/XopBot')
   let repo = 'https://github.com/AstroAnalytics/XopBot'
   const repoInfo = `
  xᴏᴘ ᴘᴀᴛᴄʜ ᴠ𝟽
╭──────────────
│ ᴜsᴇʀ : ${message.pushName}
│ sᴛᴀʀs : ${data?.stargazers_count} stars
│ ғᴏʀᴋs : ${data?.forks_count} forks
│ ᴄʀᴇᴀᴛɪᴏɴ : ${data?.created_at}
│ ʀᴇᴘᴏ : ${repo}
│ ᴜᴘᴛɪᴍᴇ : ${runtime(process.uptime())}
╰────────────── 
  `.trim()

   return await message.sendUi(message.jid, {
    caption: repoInfo,
   })
  } catch (error) {
   await message.error(`${error}\n\ncommand: repo`, error)
  }
 }
)

bot(
 {
  pattern: 'cpu',
  info: 'To check bot status',
  type: 'tools',
 },
 async (message) => {
  try {
   const memoryUsage = process.memoryUsage()
   const cpuInfo = os.cpus().map((cpu) => {
    cpu.total = Object.values(cpu.times).reduce((total, time) => total + time, 0)
    return cpu
   })

   const aggregatedCpu = cpuInfo.reduce(
    (acc, cpu) => {
     acc.total += cpu.total
     acc.speed += cpu.speed / cpuInfo.length
     acc.times.user += cpu.times.user
     acc.times.nice += cpu.times.nice
     acc.times.sys += cpu.times.sys
     acc.times.idle += cpu.times.idle
     acc.times.irq += cpu.times.irq
     return acc
    },
    {
     speed: 0,
     total: 0,
     times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
    }
   )

   const start = performance.now()
   const end = performance.now()
   const latency = end - start

   const response = `
  *Server Info*
  
    *Runtime:* ${runtime(process.uptime())}
    *Speed:* ${latency.toFixed(3)} ms
    *RAM:* ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
  
    *Memory Usage:*
        ${Object.entries(memoryUsage)
         .map(([key, value]) => `${key.padEnd(12)}: ${formatp(value)}`)
         .join('\n      ')}
  
    *Total CPU Usage:*
    *${cpuInfo[0].model.trim()} (${aggregatedCpu.speed.toFixed(2)} MHz)*
        ${Object.entries(aggregatedCpu.times)
         .map(([key, value]) => `-${key.padEnd(6)}: ${((value * 100) / aggregatedCpu.total).toFixed(2)}%`)
         .join('\n      ')}
  
    *CPU Core Usage (${cpuInfo.length} Core CPU)*
    ${cpuInfo
     .map(
      (cpu, index) => `
    *Core ${index + 1}: ${cpu.model.trim()} (${cpu.speed} MHz)*
        ${Object.entries(cpu.times)
         .map(([key, value]) => `-${key.padEnd(6)}: ${((value * 100) / cpu.total).toFixed(2)}%`)
         .join('\n      ')}`
     )
     .join('\n\n')}
  `.trim()

   return await message.send(response)
  } catch (error) {
   await message.error(`${error}\n\ncommand: cpu`, error, '*_No response from server side, Sorry!!_*')
  }
 }
)

bot(
 {
  pattern: 'ads',
  type: 'tools',
  info: 'Distribute advertisements to contacts.',
  fromMe: true,
 },
 async (message, args) => {
  try {
   const text = args || message.reply_text
   if (!text) {
    return await message.reply(`*_Provide,number range,your message*_`)
   }

   const [number, adMessage] = text.split(',').map((s) => s.trim())
   if (!number || !adMessage) {
    return await message.send('*Invalid format. Please provide number and message separated by a comma.*')
   }

   if (!number.includes('x')) {
    return await message.send(`*Number must include "x" placeholder(s). Example: ${prefix}ads 234902786xx,Your_message_here*`)
   }

   const xCount = (number.match(/x/g) || []).length
   if (xCount > 3) {
    return await message.send('*Maximum 3 "x" placeholders allowed in the number.*')
   }

   await message.send('*Initiating advertisement distribution. This may take some time.*')

   const baseNumber = number.split('x')[0]
   const suffix = number.split('x')[xCount] || ''
   const maxRange = Math.pow(10, xCount)

   let sentCount = 0
   let lastUser = ''

   for (let i = 0; i < maxRange; i++) {
    const fullNumber = `${baseNumber}${i.toString().padStart(xCount, '0')}${suffix}@s.whatsapp.net`
    const [exists] = await message.bot.onWhatsApp(fullNumber)

    if (exists) {
     await sleep(1500)
     await message.bot.sendMessage(exists.jid, { text: `${adMessage}\n` })
     sentCount++
     lastUser = exists.jid.split('@')[0]
    }
   }

   return await message.send(`*Advertisement Distribution Summary*\n\n` + `Messages sent: ${sentCount}\n` + `Last recipient: ${lastUser}\n` + `Numbers checked: ${maxRange}\n`)
  } catch (error) {
   await message.error(`Error in ads command: ${error}`, error, '*Server unresponsive. Please try again later.*')
  }
 }
)
const anonymousMessageStore = {}
let activeAnonymousRecipients = ''

class AnonymousMessage {
 constructor() {
  this.id = ''
  this.sender = ''
  this.recipient = ''
  this.originalMessage = ''
  this.explanationCount = 0
  this.replyCount = 0
 }
}

bot(
 {
  pattern: 'amsg',
  info: 'Send message anonymously',
  type: 'ai',
 },
 async (context, args, { smd: command }) => {
  try {
   const input = args || context.reply_text
   if (!input) {
    return await context.send(`*Provide number with message to send anonymously.* \n*Example: ${prefix}${command} 2348039607375,your_message*`, {}, '', context)
   }
   if (context.isCreator && input === 'info') {
    return await context.reply(activeAnonymousRecipients === '' ? '*No anonymous chats created yet*' : `*Anonymous Chat Recipients*\n_${activeAnonymousRecipients}_`)
   }
   const separatorIndex = input.indexOf(',')
   if (separatorIndex === -1) {
    return await context.reply('*Invalid format. Please provide both number and message separated by a comma.*')
   }
   const recipientNumber = input.slice(0, separatorIndex).trim() + '@s.whatsapp.net'
   const messageContent = input.slice(separatorIndex + 1).trim()
   const validatedRecipients = (await parsedJid(recipientNumber)) || []
   if (validatedRecipients[0]) {
    const { date, time } = await getDateTime()
    const messageId = 'anony-msg-' + Math.floor(100000 + Math.random() * 900000)
    anonymousMessageStore[messageId] = new AnonymousMessage()
    const currentMessage = anonymousMessageStore[messageId]
    currentMessage.id = messageId
    currentMessage.sender = context.sender
    currentMessage.recipient = validatedRecipients[0]
    currentMessage.originalMessage = context
    const formattedMessage = `*ASTA-MD • ANONYMOUS MESSAGE*\n\n*Msg_Id:* ${currentMessage.id}\n*Date:* _${date}_\n*Time:* _${time}_\n\n*Message:* ${messageContent}\n\n\n${Config.caption}`
    activeAnonymousRecipients += `,${currentMessage.recipient}`
    await context.bot.sendMessage(currentMessage.recipient, {
     text: formattedMessage,
    })
    return await context.reply('*_Anonymous message sent successfully_*')
   } else {
    return await context.reply('*_Provided number is not valid_*')
   }
  } catch (error) {
   await context.error(`${error}\n\nCommand: ${command}`, error, '*_Unable to send anonymous message at this time_*')
  }
 }
)

bot(
 {
  on: 'text',
 },
 async (context) => {
  try {
   if (context.quoted && activeAnonymousRecipients.includes(context.sender) && context.text.length > 2) {
    const quotedLines = context.reply_text.split('\n')
    if (quotedLines.length < 3) {
     return
    }
    if (context.reply_text.includes('ASTA-MD • ANONYMOUS MESSAGE') && quotedLines[0].includes('ASTA-MD • ANONYMOUS MESSAGE') && quotedLines[2].includes('Msg_Id')) {
     const messageId = quotedLines[2].replace('*Msg_Id:* ', '').trim()
     const storedMessage = anonymousMessageStore[messageId]
     if (!storedMessage) {
      return
     }
     try {
      if (storedMessage) {
       const firstWord = context.text.split(',')[0].trim().toLowerCase()
       if (firstWord === 'reply') {
        storedMessage.replyCount += 1
        const replyContent = context.text.slice(context.text.indexOf(',') + 1).trim()
        const replyMessage = `*ASTA-MD • YOUR ANONYMOUS MESSAGE REPLY*\n\n*_From @${storedMessage.recipient.split('@')[0]}_*\n*_Msg_Id: ${storedMessage.id}_*\n\n*Message:* ${replyContent}\n\n`
        if (storedMessage.replyCount >= 2) {
         activeAnonymousRecipients = activeAnonymousRecipients.replace(`,${context.sender}`, '')
        }
        await context.bot.sendMessage(
         storedMessage.sender,
         {
          text: replyMessage,
          mentions: [storedMessage.recipient],
         },
         {
          quoted: storedMessage.originalMessage,
         }
        )
        if (storedMessage.replyCount >= 2) {
         activeAnonymousRecipients = activeAnonymousRecipients.replace(`,${context.sender}`, '')
         delete anonymousMessageStore[messageId]
        }
        return await context.reply(`*_Your message successfully delivered to the user_* ${storedMessage.replyCount == 1 ? '\n*You can reply 1 more time*' : ''} `)
       } else if (storedMessage.explanationCount === 0) {
        storedMessage.explanationCount = 1
        const explanationMessage = `*This is an Anonymous Message*\n\n_Msg_Id: ${storedMessage.id}_\n_This message was sent by a chatbot_\n_The user chose not to reveal their identity_\n\n\n*If you want to reply to this user,*\n*Send a message by replying to the above message*\n*Type like:* reply, Your_Message_Here\n*Example:* reply, Can you text me from your number\n\n`
        context.bot.sendMessage(
         storedMessage.recipient,
         {
          text: explanationMessage,
         },
         {
          quoted: context,
         }
        )
       } else if (storedMessage.explanationCount === 1) {
        storedMessage.explanationCount = 2
        context.reply('*Please follow the format to reply to the message*\n*Type like: _reply, Your_Message_Here_*')
       }
      }
     } catch (error) {
      console.log('Error: ', error)
     }
    }
   }
  } catch {}
 }
)
