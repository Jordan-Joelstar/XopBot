const os = require("os");
const Config = require("../config");
const { runtime, formatp, tiny, bot } = require("../lib");
const long = String.fromCharCode(8206);
const readmore = long.repeat(4001);

bot(
 {
  cmdname: "menu",
  desc: "Show All Commands",
  dontAddCommandList: true,
 },
 async (message, input) => {
  try {
   const { commands } = require("../lib");

   let menuThemeType;
   let menuThemeHeader;
   let menuThemeFooter;
   let menuThemeCategoryHeader;
   let menuThemeCategoryFooter;
   let menuThemeCommandPrefix;
   let menuThemeCommandFooter;

   // Determine menu theme
   if (Config.menu === "") {
    menuThemeType = Math.floor(Math.random() * 4) + 1;
   }

   // Set menu theme based on type
   if (menuThemeType === 1 || Config.menu.trim().startsWith("1") || Config.menu.toLowerCase().includes("menu1")) {
    menuThemeHeader = `╭━━━〔 *${Config.botname}* 〕━━━┈⊷`;
    menuThemeCommandPrefix = "┃✵│";
    menuThemeFooter = `┃✵╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷`;
    menuThemeCategoryHeader = "╭─────────────┈⊷\n│「";
    menuThemeCategoryFooter = "」\n╰┬────────────┈⊷";
    menuThemeCommandPrefix = "││◦➛";
    menuThemeCommandFooter = "│╰────────────┈⊷\n╰─────────────┈⊷";
   } else if (menuThemeType === 2 || Config.menu.trim().startsWith("2") || Config.menu.toLowerCase().includes("menu2")) {
    menuThemeHeader = `╭═══ *${Config.botname}* ═══⊷\n┃❃╭──────────────`;
    menuThemeCommandPrefix = "┃❃│";
    menuThemeFooter = `┃❃╰───────────────\n╰═════════════════⊷`;
    menuThemeCategoryHeader = "╭─❏";
    menuThemeCategoryFooter = "❏";
    menuThemeCommandPrefix = "┃❃│";
    menuThemeCommandFooter = `┃❃╰───────────────\n╰═════════════════⊷`;
   } else {
    menuThemeHeader = `╭〘  ${Config.botname}  〙`;
    menuThemeCommandPrefix = "│ │";
    menuThemeFooter = "╰═══════════════⊷";
    menuThemeCategoryHeader = "╭─❍";
    menuThemeCategoryFooter = "══⊷❍";
    menuThemeCommandPrefix = "│";
    menuThemeCommandFooter = "╰════════════─⊷";
   }

   // Categorize commands
   const categorizedCommands = {};
   commands.forEach((command) => {
    if (command.dontAddCommandList === false && command.pattern !== undefined) {
     if (!categorizedCommands[command.category]) {
      categorizedCommands[command.category] = [];
     }
     categorizedCommands[command.category].push(command.pattern);
    }
   });

   const currentTime = message.time;
   const currentDate = message.date;
   const currentUser = message.sender.split("@")[0]

   // Construct the menu text
   let menuText = `
╭════〔 xᴘᴏ ᴍᴅ 〕═════┈⊷
┃✺╭──────────────
┃✺│ User : ${currentUser}
┃✺│ Time : ${currentTime}
┃✺│ Date : ${currentDate}
┃✺│ Uptime : ${runtime(process.uptime())}
┃✺│ Ram Usage: ${formatp(os.totalmem() - os.freemem())}
┃✺│ Plugins : ${commands.length}
┃✺╰──────────────
╰═══════════════⊷
*ᴠᴇʀsɪᴏɴ 𝟷.𝟶*
${readmore}`;

   // Append commands to the menu text
   for (const category in categorizedCommands) {
    menuText += `
${menuThemeCategoryHeader} *${tiny(category)}* ${menuThemeCategoryFooter}\n`;

    for (const command of categorizedCommands[category]) {
     menuText += `${menuThemeCommandPrefix} ${Config.HANDLERS} ${tiny(command, 1)}\n`;
    }

    menuText += `${menuThemeCommandFooter}\n`;

    // If input matches the category, break after appending its commands
    if (input.toLowerCase() === category.toLowerCase()) {
     break;
    }
   }

   menuText += Config.caption;

   const messageOptions = {
    caption: menuText,
    ephemeralExpiration: 30,
   };

   return await message.sendUi(message.chat, messageOptions, message);
  } catch (error) {
   await message.error(`${error}\nCommand: menu`, error);
  }
 }
);
