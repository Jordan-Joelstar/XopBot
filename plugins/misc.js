const { bot, fancytext, runtime, formatp, prefix } = require('../lib')
const config = require('../config')
const axios = require('axios')
const os = require('os')
const speed = require('performance-now')
const { URLSearchParams } = require('url')
bot(
 {
  pattern: 'alive',
  desc: 'Shows system status with different designs.',
  type: 'misc',
 },
 async (message) => {
  try {
   const start = new Date().getTime()
   const designs = [
    async () => {
     const imageBuffer = await axios.get('https://i.imgur.com/z20pSwu.jpeg', {
      responseType: 'arraybuffer',
     })

     const quoteResponse = await axios.get('https://api.maher-zubair.tech/misc/quote')
     const quote = quoteResponse.data
     if (!quote || quote.status !== 200) {
      return await message.reply('*Failed to fetch a quote.*')
     }

     const quoteText = `\n\n*"${quote.result.body}"*\n_- ${quote.result.author}_`
     const end = new Date().getTime()
     const pingSeconds = (end - start) / 1000
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds${quoteText}`

     return { image: imageBuffer.data, caption: captionText }
    },
    async () => {
     const imageBuffer = await axios.get('https://i.imgur.com/lIo3cM2.jpeg', {
      responseType: 'arraybuffer',
     })

     const factResponse = await axios.get('https://api.maher-zubair.tech/misc/fact')
     const fact = factResponse.data
     if (!fact || fact.status !== 200) {
      return await message.reply('*Failed to fetch a fact.*')
     }

     const end = new Date().getTime()
     const pingSeconds = (end - start) / 1000
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds\n\n\n${fact.result.fact}`

     return { image: imageBuffer.data, caption: captionText }
    },
    async () => {
     const imageBuffer = await axios.get('https://i.imgur.com/OQOH4Gn.jpeg', {
      responseType: 'arraybuffer',
     })

     const lineResponse = await axios.get('https://api.maher-zubair.tech/misc/lines')
     const line = lineResponse.data
     if (!line || line.status !== 200) {
      return await message.reply('*Failed to fetch a line.*')
     }

     const end = new Date().getTime()
     const pingSeconds = (end - start) / 1000
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds\n\n\n${line.result}`

     return { image: imageBuffer.data, caption: captionText }
    },
   ]

   const randomDesign = designs[Math.floor(Math.random() * designs.length)]
   const messageData = await randomDesign()

   return await message.bot.sendMessage(message.chat, messageData)
  } catch (error) {
   await message.error(error + '\n\nCommand: alive', error)
  }
 }
)

bot(
 {
  pattern: 'cmds',
  desc: 'List menu',
  category: 'general',
 },
 async (context) => {
  try {
   const { commands } = require('../lib')
   let commandInfo = '\n\t*ᴄᴏᴍᴍᴀɴᴅs ɪɴғᴏ*\n'
   commands.forEach((command, index) => {
    if (command.pattern) {
     commandInfo += `*${index + 1} ${fancytext(command.pattern, 1)}*\n`
     commandInfo += `  ${fancytext(command.desc, 1)}\n`
    }
   })
   return await context.sendUi(context.chat, {
    caption: commandInfo + config.caption,
   })
  } catch (error) {
   await context.error(error + '\nCommand: list', error)
  }
 }
)

bot(
 {
  pattern: 'owner',
  desc: 'Show owner contact',
  category: 'user',
 },
 async (context) => {
  try {
   const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownername}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${global.owner?.split(',')[0]}:+${global.owner?.split(',')[0]}\nEND:VCARD`
   const contactInfo = {
    contacts: {
     displayName: config.ownername,
     contacts: [{ vcard }],
    },
    contextInfo: {
     externalAdReply: {
      title: config.ownername,
      body: 'Touch here.',
      renderLargerThumbnail: true,
      thumbnail: log0,
      mediaType: 1,
      sourceUrl: `https://wa.me/+${global.owner?.split(',')[0]}?text=Hii+${config.ownername}`,
     },
    },
   }
   return await context.sendMessage(context.jid, contactInfo, { quoted: context })
  } catch (error) {
   await context.error(error + '\nCommand: owner', error)
  }
 }
)

bot(
 {
  pattern: 'ping',
  desc: 'Check ping',
  category: 'user',
 },
 async (context) => {
  const startTime = new Date().getTime()
  const { key: messageKey } = await context.reply('_...._')
  const endTime = new Date().getTime()
  const pingTime = endTime - startTime
  await context.send(`*ʟᴀᴛᴇɴᴄʏ: ${pingTime} ms*`, { edit: messageKey }, '', context)
 }
)

bot(
 {
  pattern: 'setcmd',
  desc: 'Set command alias',
  category: 'user',
  fromMe: true,
 },
 async (context, message, { Void }) => {
  try {
   if (!message) {
    return await context.send('*_Please provide cmd name by replying to a Sticker_*')
   }
   const [newName, cmdName] = message.split(',').map((item) => item.trim().toLowerCase())
   if (!newName || !cmdName) {
    return await context.send('*_Please provide both new and old command names_*')
   }
   if (global.setCmdAlias[newName]) {
    return await context.send(`*_"${newName}" is already set for "${global.setCmdAlias[newName]}" cmd, please try another name_*`)
   }
   const existingCmd = bot.commands.find((cmd) => cmd.pattern === cmdName || (cmd.alias && cmd.alias.includes(cmdName)))
   if (existingCmd) {
    global.setCmdAlias[newName] = existingCmd.pattern
    return await context.send(`*_Command "${existingCmd.pattern}" successfully set to "${newName}"._*`)
   } else {
    return await context.send('*_Provided command not found. Please provide a valid command name_*')
   }
  } catch (error) {
   await context.error(error + '\nCommand: setcmd', error)
  }
 }
)

bot(
 {
  pattern: 'delcmd',
  desc: 'Delete command alias',
  category: 'user',
  fromMe: true,
 },
 async (context, message, { Void }) => {
  try {
   const cmdName = message ? message.split(' ')[0].trim().toLowerCase() : ''
   if (!cmdName) {
    return await context.send('*_Please provide the name of the command to delete_*')
   }
   if (global.setCmdAlias[cmdName]) {
    await context.send(`*_"${cmdName}" deleted successfully from "${global.setCmdAlias[cmdName]}" command_*`)
    delete global.setCmdAlias[cmdName]
   } else {
    return await context.send(`*_"${cmdName}" not set for any command. Please provide a valid name to delete_*`)
   }
  } catch (error) {
   await context.error(error + '\nCommand: delcmd', error)
  }
 }
)
bot(
 {
  cmdname: 'ping2',
  alias: ['botstatus', 'statusbot', 'p2'],
  type: 'misc',
  info: 'Get random poetry lines',
 },
 async (context) => {
  try {
   const memoryUsage = process.memoryUsage()
   const cpuInfo = os.cpus().map((cpu) => {
    cpu.total = Object.values(cpu.times).reduce((total, time) => total + time, 0)
    return cpu
   })

   const totalCpuUsage = cpuInfo.reduce(
    (acc, cpu, _, { length }) => {
     acc.total += cpu.total
     acc.speed += cpu.speed / length
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

   const startSpeed = speed()
   const endSpeed = speed()
   const responseTime = endSpeed - startSpeed

   const startTime = performance.now()
   const endTime = performance.now()
   const executionTime = endTime - startTime

   const response = `
  Response Speed: ${responseTime.toFixed(4)} seconds
  Execution Time: ${executionTime.toFixed(2)} milliseconds
  
  Runtime: ${runtime(process.uptime())}
  
  *Server Info*
  RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
  
  _NodeJS Memory Usage_
  ${Object.keys(memoryUsage)
   .map((key) => `${key.padEnd(20)}: ${formatp(memoryUsage[key])}`)
   .join('\n')}
  
  ${
   cpuInfo[0]
    ? `_Total CPU Usage_
  ${cpuInfo[0].model.trim()} (${totalCpuUsage.speed.toFixed(2)} MHz)
  ${Object.keys(totalCpuUsage.times)
   .map((key) => `- *${key}* : ${((totalCpuUsage.times[key] * 100) / totalCpuUsage.total).toFixed(2)}%`)
   .join('\n')}`
    : ''
  }
  `.trim()

   context.reply(response)
  } catch (error) {
   await context.error(error + '\n\nCommand: ping2', error, false)
  }
 }
)
bot(
 {
  pattern: 'setcap',
  desc: 'Set caption for replied message',
  category: 'misc',
 },
 async (context, text) => {
  try {
   const message = context.reply_message
   if (!message || !text) {
    return await context.reply('_Need Text_')
   }

   if (message.image || message.video || message.mtype.includes('document')) {
    const [captionText, fileNameText] = text.split('|').map((part) => part.trim())
    const caption = message.mtype.includes('document') ? captionText : text
    const fileName = fileNameText || 'null'

    message.message[message.mtype].caption = caption
    message.message[message.mtype].fileName = fileName
    await context.bot.copyNForward(context.chat, message)
   } else {
    return await context.reply('_Reply Audio/Video/Doc_')
   }
  } catch (error) {
   await context.error(`Error: ${error}\n\nCommand: caption`, error, false)
  }
 }
)

bot(
 {
  pattern: 'todoc',
  desc: 'Send document for replied image/video message',
  category: 'misc',
 },
 async (context, text) => {
  try {
   const message = context.image || context.video ? context : context.reply_message && (context.reply_message.image || context.reply_message.video) ? context.reply_message : false

   if (!message) {
    return await context.reply('_Reply to an image/video message!_')
   }

   if (!text) {
    return await context.reply('_Need fileName, Example: document asta | caption_')
   }

   const mediaPath = await context.bot.downloadAndSaveMediaMessage(message)
   const separator = text.includes(':') ? ':' : text.includes(';') ? ';' : '|'
   const [fileName, caption] = text.split(separator).map((part) => part.trim())
   const fileType = message.image ? 'jpg' : 'mp4'
   const captionText = ['copy', 'default', 'old', 'reply'].includes(caption) ? message.text : caption

   if (mediaPath) {
    context.bot.sendMessage(context.chat, {
     document: { url: mediaPath },
     mimetype: message.mimetype,
     fileName: `${fileName}.${fileType}`,
     caption: captionText,
    })
   } else {
    context.reply('*Request Denied!*')
   }
  } catch (error) {
   await context.error(`Error: ${error}\n\nCommand: todoc`, error, false)
  }
 }
)

bot(
 {
  pattern: 'tovv',
  desc: 'Send view-once for replied image/video message',
  category: 'misc',
 },
 async (context, caption) => {
  try {
   const message = context.image || context.video ? context : context.reply_message && (context.reply_message.image || context.reply_message.video) ? context.reply_message : false

   if (!message) {
    return await context.reply('_Reply to image/video with caption!_')
   }

   const mediaPath = await context.bot.downloadAndSaveMediaMessage(message)
   const mediaType = message.image ? 'image' : 'video'

   if (mediaPath) {
    context.bot.sendMessage(
     context.chat,
     {
      [mediaType]: { url: mediaPath },
      caption: caption,
      mimetype: message.mimetype,
      fileLength: '99999999',
      viewOnce: true,
     },
     { quoted: message }
    )
   } else {
    context.reply('*Request Denied!*')
   }
  } catch (error) {
   await context.error(`Error: ${error}\n\nCommand: tovv`, error, false)
  }
 }
)

bot(
 {
  pattern: 'ip',
  type: 'misc',
  info: "Get the bot's IP address",
 },
 async (context) => {
  try {
   const { data: ipAddress } = await axios.get('https://api.ipify.org/')
   const responseMessage = ipAddress ? `*Bot's IP address is: _${ipAddress}_*` : '_No response from server!_'
   context.send(responseMessage)
  } catch (error) {
   await context.error(`Error: ${error}\n\nCommand: myip`, error, false)
  }
 }
)

const captureScreenshot = (url, device = 'desktop') => {
 return new Promise((resolve, reject) => {
  const screenshotApiUrl = 'https://www.screenshotmachine.com/capture.php'
  const requestData = {
   url,
   device,
   cacheLimit: 0,
  }

  axios
   .post(screenshotApiUrl, new URLSearchParams(requestData), {
    headers: {
     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
   })
   .then((response) => {
    const cookies = response.headers['set-cookie']
    if (response.data.status === 'success') {
     axios
      .get(`https://www.screenshotmachine.com/${response.data.link}`, {
       headers: { cookie: cookies.join('') },
       responseType: 'arraybuffer',
      })
      .then(({ data }) => {
       resolve({ status: 200, result: data })
      })
    } else {
     reject({
      status: 404,
      statusText: 'Link Error',
      message: response.data,
     })
    }
   })
   .catch(reject)
 })
}

bot(
 {
  pattern: 'ss',
  type: 'misc',
  info: 'Get a screenshot of a webpage',
 },
 async (context, args) => {
  try {
   const url = args.split(' ')[0].trim()
   if (!url) {
    return await context.reply(`_Need Website Link?_`)
   }

   const screenshotResponse = await captureScreenshot(url)
   if (screenshotResponse.status === 200) {
    return await context.send(
     screenshotResponse.result,
     {
      caption: config.caption,
     },
     'amdimg',
     context
    )
   } else {
    await context.send('_No response from server!_')
   }
  } catch (error) {
   await context.error(`Error: ${error}\n\nCommand: ss`, error, '*Request Denied!*')
  }
 }
)
