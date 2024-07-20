const { Sequelize } = require('sequelize')
const fs = require('fs')

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env', override: true })
function convertToBool(text, fault = 'true') {
 return text === fault ? true : false
}

const toBool = (x) => (x && x.toLowerCase() === 'true') || false
global.SESSION_ID = process.env.SESSION_ID || ''
module.exports = {
 DATABASE_URL: DATABASE_URL,
 DATABASE: DATABASE_URL === './database.db' ? new Sequelize({ dialect: 'sqlite', storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, { dialect: 'postgres', ssl: true, protocol: 'postgres', dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false } }, logging: false }),
 BRAIN_ID: process.env.BRAIN_ID || 'bid=168613&key=EfbnX54Iy9PFIFp3',
 MSG_STYLE: process.env.STYLE || '0',
 WA_PRESENCE: process.env.WAPRESENCE || 'online',
 AUTO_SAVE_STATUS_FROM: process.env.AUTO_STATUS_FROM || '',
 READ_MSG_FROM: process.env.READ_MSG_FROM || 'null',
 AUTO_READ_MSG: process.env.AUTO_READ_MSG || 'false',
 AUTO_READ_CMD: process.env.AUTO_READ_CMD || 'false',
 AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || 'false',
 AUTO_SAVE_STATUS: process.env.AUTO_READ_STATUS || 'false',
 HANDLERS: process.env.PREFIX || '.',
 TIME_ZONE: process.env.TIME_ZONE || 'Africa/Lagos',
 BRANCH: process.env.BRANCH || 'main',
 VERSION: process.env.VERSION || '1.0',
 caption: process.env.CAPTION || '© xᴏᴘ',
 author: process.env.PACK_AUTHER || 'ᴀsᴛʀᴏ',
 packname: process.env.PACK_NAME || 'xᴏᴘ',
 botname: process.env.BOT_NAME || 'xᴏᴘ ʙᴏᴛ',
 ownername: process.env.OWNER_NAME || 'ᴀsᴛʀᴏ',
 errorChat: process.env.ERROR_CHAT || '',
 KOYEB_API: process.env.KOYEB_API || 'false',
 REMOVE_BG_KEY: process.env.REMOVE_BG_KEY || '',
 OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
 HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
 HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
 antilink_values: process.env.ANTILINK_VALUES || 'all',
 HEROKU: process.env.HEROKU_APP_NAME && process.env.HEROKU_API_KEY,
 aitts_Voice_Id: process.env.AITTS_ID || '37',
 ELEVENLAB_API_KEY: process.env.ELEVENLAB_API_KEY || '',
 WORKTYPE: process.env.WORKTYPE || process.env.MODE || 'private',
 LANG: (process.env.THEME || 'ASTA').toUpperCase(),
}
global.rank = 'updated'
global.isMongodb = false
let file = require.resolve(__filename)
fs.watchFile(file, () => {
 fs.unwatchFile(file)
 console.log(`Update'${__filename}'`)
 delete require.cache[file]
 require(file)
})

global.port = process.env.PORT
global.appUrl = process.env.APP_URL || ''
global.email = 'astromedia0010@gmail.com'
global.location = 'Lahore,Pakistan.'
global.mongodb = process.env.MONGODB_URI || ''
global.allowJids = process.env.ALLOW_JID || 'null'
global.blockJids = process.env.BLOCK_JID || 'null'
global.github = process.env.GITHUB || 'https://github.com/Astropeda/Asta-Md'
global.gurl = process.env.URL || 'https://whatsapp.com/channel/0029VaPGt3QEwEjpBXT4Rv0z'
global.website = process.env.WEBSITE || 'https://whatsapp.com/channel/0029VaPGt3QEwEjpBXT4Rv0z'
global.THUMB_IMAGE = process.env.THUMB_IMAGE || process.env.IMAGE || 'https://raw.githubusercontent.com/AstroAnalytics/XopBot/main/lib/assets/logo.jpeg'
global.devs = '2348039607375'
global.sudo = process.env.SUDO || '2348039607375'
global.owner = process.env.OWNER_NUMBER || '2348039607375'
global.gdbye = process.env.GOODBYE || 'false'
global.wlcm = process.env.WELCOME || 'false'
global.warncount = process.env.WARN_COUNT || 3
global.disablepm = process.env.DISABLE_PM || 'false'
;(global.disablegroup = process.env.DISABLE_GROUPS || 'false'), (global.MsgsInLog = process.env.MSGS_IN_LOG || 'true')
global.userImages = process.env.USER_IMAGES || 'https://raw.githubusercontent.com/AstroAnalytics/XopBot/main/source/images/logo1.jpeg,https://raw.githubusercontent.com/AstroAnalytics/XopBot/main/source/images/logo2.jpeg,https://raw.githubusercontent.com/AstroAnalytics/XopBot/main/source/images/logo3.jpeg'
