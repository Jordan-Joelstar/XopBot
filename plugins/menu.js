/*const os = require('os')
const { runtime, formatp, tiny, bot } = require('../lib')
const config = require('../config')
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

   return await message.sendUi(message.chat, messageOptions)
  } catch (error) {
   await message.error(`${error}\nCommand: menu`, error)
  }
 }
)
*/

const os = require('os')
const { runtime, formatp, tiny, bot } = require('../lib')
const config = require('../config')

bot(
 {
  pattern: 'newmenu',
  desc: 'Show All Commands',
  dontAddCommandList: true,
 },
 async (message, input) => {
  try {
   const { commands } = require('../lib')
   const categorizedCommands = {}

   // Categorize commands
   commands.forEach((command) => {
    if (!command.dontAddCommandList && command.pattern) {
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

   // Create button options
   const buttonOptions = [
    {
     name: 'cta_url',
     buttonParamsJson: JSON.stringify({
      display_text: 'Visit Website',
      url: 'https://example.com',
     }),
    },
   ]

   // Send the menu with buttons
   const messageOptions = {
    caption: menuText,
    buttons: buttonOptions,
   }

   return await message.sendUi(message.chat, messageOptions)
  } catch (error) {
   await message.error(`${error}\nCommand: newmenu`, error)
  }
 }
)
