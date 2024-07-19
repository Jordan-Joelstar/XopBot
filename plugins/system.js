const fs = require('fs')
const { exec } = require('child_process')
const { plugins, bot, runtime } = require('../lib')
const isOwner = true

bot(
 {
  pattern: 'shutdown',
  info: 'To shutdown bot',
  type: 'tools',
  fromMe: isOwner,
 },
 async (message) => {
  message.reply('Shutting Down')
  exec('pm2 stop all')
 }
)

bot(
 {
  pattern: 'restart',
  info: 'To restart bot',
  type: 'tools',
  fromMe: isOwner,
 },
 async (message) => {
  message.reply('Restarting')
  exec('pm2 restart all')
 }
)

bot(
 {
  pattern: 'plugins',
  type: 'tools',
  info: 'Shows list of all externally installed modules',
  fromMe: isOwner,
 },
 async (message, args) => {
  try {
   const pluginList = await plugins(message, 'plugins', args)
   const response = !pluginList ? `*_There's no plugin installed_*` : !args ? `*All Installed Modules are:*\n\n${pluginList}` : pluginList
   await message.send(response)
  } catch (error) {
   message.error(`${error} \n\ncmdName plugins\n`)
  }
 }
)

bot(
 {
  pattern: 'remove',
  type: 'tools',
  info: 'Removes external modules.',
  fromMe: isOwner,
 },
 async (message, args) => {
  if (!args) {
   return await message.reply('*_Provide Plugin Name_*')
  }

  if (args === 'all') {
   return await message.reply(await plugins('remove', 'all', __dirname))
  }

  try {
   const result = await plugins(message, 'remove', args, __dirname)
   await message.send(result)
  } catch (error) {
   message.error(`Error removing plugin: ${error}`)
  }
 }
)

bot(
 {
  pattern: 'install',
  type: 'tools',
  info: 'Installs external modules.',
  fromMe: isOwner,
 },
 async (message, args) => {
  const url = args || (message.quoted ? message.quoted.text : '')

  if (!url.toLowerCase().includes('https')) {
   return await message.send('*_Provide Plugin URL_*')
  }

  const result = await plugins(message, 'install', url, __dirname)
  await message.reply(result)
 }
)

bot(
 {
  pattern: 'cache',
  type: 'tools',
  info: 'Clear temporary files cache',
 },
 async (message) => {
  try {
   const tempDir = './temp'
   if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach((file) => fs.rmSync(`${tempDir}/${file}`))
   }
   await message.reply('Cache Cleared From Bot_')
  } catch (error) {
   message.error(`${error}\n\nCommand: cleartmp`, error, false)
  }
 }
)

bot(
 {
  pattern: 'issue',
  desc: 'Report bug/features of bot to its creator!',
  type: 'tools',
 },
 async (message, args) => {
  try {
   if (!args) {
    return message.reply('_Write Your Bot Issue!_')
   }
   if (args.split(' ').length < 10) {
    return message.reply('_Write Atleast 10 Words_')
   }

   const header = '*XPO BOT ISSUE REPORT*'
   const body = `\n\n*User*: @${message.senderNum}\n\n*ISSUES PAGE*: ${args}`
   const footer = `\n\n_${message.senderName.split('\n').join(' ')}, Issues sent!_`
   await message.sendMessage(
    '2348039607375@s.whatsapp.net',
    {
     text: header + body,
     mentions: [message.sender],
    },
    {
     quoted: message,
    }
   )
   await message.reply(
    header + footer + body,
    {
     mentions: [message.sender],
    },
    message
   )
  } catch (error) {
   message.error(`${error}\n\nCommand: request`, error, false)
  }
 }
)

bot({
 name: 'uptime',
 alias: ['runtime'],
 type: 'tools',
 desc: 'Get bot runtime information',
 async execute(message, args) {
  try {
   const uptime = runtime(process.uptime())
   const response = `*Bot Uptime: ${uptime}*`
   await message.reply(response)
  } catch (error) {
   console.error('Error in uptime command:', error)
   await message.reply('An error occurred while fetching uptime information.')
  }
 },
})
