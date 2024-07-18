const toBool = (x) => x == "true";
const { Sequelize } = require("sequelize");
const { existsSync } = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "./config.env");
const databasePath = path.join(__dirname, "./database.db");
const fs = require("fs-extra");
if (fs.existsSync(".env")) require("dotenv").config({ path: __dirname + "/.env" });
global.port = process.env.PORT;
global.appUrl = process.env.APP_URL || "";
global.email = "astromedia0010@gmail.com";
global.location = "Lahore,Pakistan.";
global.mongodb = process.env.MONGODB_URI || "";
global.allowJids = process.env.ALLOW_JID || "null";
global.blockJids = process.env.BLOCK_JID || "null";
global.DATABASE_URL = process.env.DATABASE_URL || "";
global.github = process.env.GITHUB || "https://github.com/Astropeda/Asta-Md";
global.gurl = process.env.URL || "https://whatsapp.com/channel/0029VaPGt3QEwEjpBXT4Rv0z";
global.website = process.env.WEBSITE || "https://whatsapp.com/channel/0029VaPGt3QEwEjpBXT4Rv0z";
global.THUMB_IMAGE = process.env.THUMB_IMAGE || process.env.IMAGE || "https://raw.githubusercontent.com/AstroAnalytics/XopBot/main/lib/assets/logo.jpeg";
global.devs = "2348039607375";
global.sudo = process.env.SUDO || "2348039607375";
global.owner = process.env.OWNER_NUMBER || "2348039607375";
global.style = process.env.STYLE || "2";
global.gdbye = process.env.GOODBYE || "false";
global.wlcm = process.env.WELCOME || "false";
global.warncount = process.env.WARN_COUNT || 3;
global.disablepm = process.env.DISABLE_PM || "false";
(global.disablegroup = process.env.DISABLE_GROUPS || "false"), (global.MsgsInLog = process.env.MSGS_IN_LOG || "true");
global.userImages = process.env.USER_IMAGES || "";
global.waPresence = process.env.WAPRESENCE || "online";


global.SESSION_ID = process.env.SESSION_ID || "";
module.exports = {
 menu: process.env.MENU || "",
 HANDLERS: process.env.PREFIX || "/",
 TIME_ZONE: process.env.TIME_ZONE || 'Africa/Lagos',
 BRANCH: process.env.BRANCH || "main",
 VERSION: process.env.VERSION || "1.0.0",
 caption: process.env.CAPTION || "©ᴀsᴛᴀ ᴍᴅ",
 author: process.env.PACK_AUTHER || "ᴀsᴛᴀ ᴍᴅ",
 packname: process.env.PACK_NAME || "♥️",
 botname: process.env.BOT_NAME || "ᴀsᴛᴀ ᴍᴅ",
 ownername: process.env.OWNER_NAME || "ᴀsᴛᴀ",
 errorChat: process.env.ERROR_CHAT || "",
 KOYEB_API: process.env.KOYEB_API || "false",
 REMOVE_BG_KEY: process.env.REMOVE_BG_KEY || "",
 OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
 HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
 HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
 antilink_values: process.env.ANTILINK_VALUES || "all",
 HEROKU: process.env.HEROKU_APP_NAME && process.env.HEROKU_API_KEY,
 aitts_Voice_Id: process.env.AITTS_ID || "37",
 ELEVENLAB_API_KEY: process.env.ELEVENLAB_API_KEY || "",
 WORKTYPE: process.env.WORKTYPE || process.env.MODE || "private",
 LANG: (process.env.THEME || "ASTA").toUpperCase(),
};
global.rank = "updated";
global.isMongodb = false;
let file = require.resolve(__filename);
fs.watchFile(file, () => {
 fs.unwatchFile(file);
 console.log(`Update'${__filename}'`);
 delete require.cache[file];
 require(file);
});
