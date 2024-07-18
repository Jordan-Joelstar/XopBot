const { bot } = require("../lib");
const axios = require("axios");
const os = require("os");
const fs = require("fs");
const Config = require("../config");
const translatte = require("translatte");
const cron = require("node-cron");
var cronStart = false;
const cpuModel = os.cpus()[0].model;
const axios = require("axios");
let {
  fancytext,
  tlang,
  runtime,
  formatp,
  prefix,
  tiny,
  smd,
  bot,
} = require("../lib");
const util = require("util");
const { cmd } = require("../lib/plugins");
const astro_patch = require("../lib/plugins");
const events = astro_patch;
const { exec } = require("child_process");
bot(
 {
  pattern: "alive",
  desc: "Shows system status with different designs.",
  type: "misc",
 },
 async (message) => {
  try {
   const start = new Date().getTime();
   const designs = [
    async () => {
     const imageBuffer = await axios.get("https://i.imgur.com/z20pSwu.jpeg", {
      responseType: "arraybuffer",
     });

     const quoteResponse = await axios.get("https://api.maher-zubair.tech/misc/quote");
     const quote = quoteResponse.data;
     if (!quote || quote.status !== 200) {
      return await message.reply("*Failed to fetch a quote.*");
     }

     const quoteText = `\n\n*"${quote.result.body}"*\n_- ${quote.result.author}_`;
     const end = new Date().getTime();
     const pingSeconds = (end - start) / 1000;
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds${quoteText}`;

     return { image: imageBuffer.data, caption: captionText };
    },
    async () => {
     const imageBuffer = await axios.get("https://i.imgur.com/lIo3cM2.jpeg", {
      responseType: "arraybuffer",
     });

     const factResponse = await axios.get("https://api.maher-zubair.tech/misc/fact");
     const fact = factResponse.data;
     if (!fact || fact.status !== 200) {
      return await message.reply("*Failed to fetch a fact.*");
     }

     const end = new Date().getTime();
     const pingSeconds = (end - start) / 1000;
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds\n\n*Fact:*\n${fact.result.fact}`;

     return { image: imageBuffer.data, caption: captionText };
    },
    async () => {
     const imageBuffer = await axios.get("https://i.imgur.com/OQOH4Gn.jpeg", {
      responseType: "arraybuffer",
     });

     const lineResponse = await axios.get("https://api.maher-zubair.tech/misc/lines");
     const line = lineResponse.data;
     if (!line || line.status !== 200) {
      return await message.reply("*Failed to fetch a line.*");
     }

     const end = new Date().getTime();
     const pingSeconds = (end - start) / 1000;
     const captionText = `ʀᴇʟᴇᴀsᴇ ᴠ𝟽\n\n*ʀᴇsᴘᴏɴsᴇ ʀᴀᴛᴇ:* ${pingSeconds} seconds\n\n*Line:*\n${line.result}`;

     return { image: imageBuffer.data, caption: captionText };
    },
   ];

   const randomDesign = designs[Math.floor(Math.random() * designs.length)];
   const messageData = await randomDesign();

   const message_options = {
    quoted: message,
    contextInfo: {
     forwardingScore: 999,
     isForwarded: true,
    },
   };

   return await message.bot.sendMessage(message.chat, messageData, message_options);
  } catch (error) {
   await message.error(error + "\n\nCommand: alive", error);
  }
 }
);

astro_patch.cmd({
    pattern: "list",
    desc: "list menu",
    category: "general",
    react: "🥀"
  }, async _0x1d5ddc => {
    try {
      const {
        commands: _0x7cfe13
      } = require("../lib");
      let _0x95885d = "\n\t*ᴀsᴛᴀ ᴍᴅ ᴄᴏᴍᴍᴀɴᴅs ɪɴғᴏ*  \n";
      for (let _0x2bd72c = 0; _0x2bd72c < _0x7cfe13.length; _0x2bd72c++) {
        if (_0x7cfe13[_0x2bd72c].pattern == undefined) {
          continue;
        }
        _0x95885d += "*" + (_0x2bd72c + 1) + " " + fancytext(_0x7cfe13[_0x2bd72c].pattern, 1) + "*\n";
        _0x95885d += "  " + fancytext(_0x7cfe13[_0x2bd72c].desc, 1) + "\n";
      }
      return await _0x1d5ddc.sendUi(_0x1d5ddc.chat, {
        caption: _0x95885d + Config.caption
      });
    } catch (_0x3e730d) {
      await _0x1d5ddc.error(_0x3e730d + "\nCommand:list", _0x3e730d);
    }
  });

  astro_patch.smd(
    {
      pattern: "owner",
      desc: "To check ping",
      category: "user",
      filename: __filename,
    },
    async (_0x563719) => {
      try {
        const _0x389599 =
          "BEGIN:VCARD\nVERSION:3.0\nFN:" +
          Config.ownername +
          "\nORG:;\nTEL;type=CELL;type=VOICE;waid=" +
          global.owner?.split(",")[0] +
          ":+" +
          global.owner?.split(",")[0] +
          "\nEND:VCARD";
        let _0x140248 = {
          contacts: {
            displayName: Config.ownername,
            contacts: [
              {
                vcard: _0x389599,
              },
            ],
          },
          contextInfo: {
            externalAdReply: {
              title: Config.ownername,
              body: "Touch here.",
              renderLargerThumbnail: true,
              thumbnailUrl: "",
              thumbnail: log0,
              mediaType: 1,
              mediaUrl: "",
              sourceUrl:
                "https://wa.me/+" +
                global.owner?.split(",")[0] +
                "?text=Hii+" +
                Config.ownername,
            },
          },
        };
        return await _0x563719.sendMessage(_0x563719.jid, _0x140248, {
          quoted: _0x563719,
        });
      } catch (_0x26ce8b) {
        await _0x563719.error(_0x26ce8b + "\nCommand:owner", _0x26ce8b);
      }
    }
  );
  astro_patch.smd(
    {
      pattern: "ping",
      desc: "To check ping",
      category: "user",
      filename: __filename,
    },
    async (context) => {
      const startTime = new Date().getTime();
      const { key: messageKey } = await context.reply("*hmm...*");
      const endTime = new Date().getTime();
      const pingTime = endTime - startTime;
      await context.send(
        `*ʟᴀᴛᴇɴᴄʏ: ${pingTime} ᴍs*`,
        { edit: messageKey },
        "",
        context
      );
    }
  );
  astro_patch.cmd(
    {
      pattern: "setcmd",
      desc: "To check ping",
      category: "user",
      fromMe: true,
      filename: __filename,
    },
    async (_0x5d887, _0x291296, { Void: _0x43ee74 }) => {
      try {
        if (!_0x291296) {
          return await _0x5d887.send(
            "*_Please provide cmd name by replying a Sticker_*"
          );
        }
        let _0x584a9e = _0x291296.split(",");
        var _0x5b0dfd;
        var _0x3be11d;
        let _0x17bd8a = false;
        if (_0x5d887.quoted) {
          let _0x1f29ea = _0x5d887.quoted.mtype;
          if (_0x1f29ea == "stickerMessage" && _0x291296) {
            _0x17bd8a = true;
            _0x5b0dfd = _0x291296.split(" ")[0];
            _0x3be11d = "sticker-" + _0x5d887.quoted.msg.fileSha256;
          }
        }
        if (!_0x17bd8a && _0x584a9e.length > 1) {
          _0x3be11d = _0x584a9e[0].trim().toLowerCase();
          _0x5b0dfd = _0x584a9e[1].trim().toLowerCase();
        } else if (!_0x17bd8a) {
          return await _0x5d887.send(
            "*_Uhh Dear, Give Cmd With New Name_*\n*Eg: _.setcmd New_Name, Cmd_Name_*"
          );
        }
        if (_0x3be11d.length < 1) {
          return await _0x5d887.reply(
            "*_Uhh Please, Provide New_Cmd Name First_*"
          );
        }
        if (global.setCmdAlias[_0x3be11d]) {
          return await _0x5d887.send(
            '*_"' +
              (_0x17bd8a ? "Given Sticker" : _0x3be11d) +
              '" Already set for "' +
              global.setCmdAlias[_0x3be11d] +
              '" Cmd, Please try another ' +
              (_0x17bd8a ? "Sticker" : "Name") +
              "_*"
          );
        }
        const _0x8e739e =
          astro_patch.commands.find(
            (_0xd9686c) => _0xd9686c.pattern === _0x5b0dfd
          ) ||
          astro_patch.commands.find(
            (_0x31fef3) => _0x31fef3.alias && _0x31fef3.alias.includes(_0x5b0dfd)
          );
        if (_0x8e739e) {
          global.setCmdAlias[_0x3be11d] = _0x8e739e.pattern;
          return await _0x5d887.send(
            '*_Cmd "' +
              global.setCmdAlias[_0x3be11d] +
              '" Succesfully set to "' +
              (_0x17bd8a ? "Sticker" : _0x3be11d) +
              '"._*\n*_These all names are reset, If bot restart_*'
          );
        } else {
          return await _0x5d887.send(
            "*_Provided Cmd( " +
              _0x5b0dfd +
              ") not found in bot cmds. Please Provide Valid cmd Name_*"
          );
        }
      } catch (_0x13e052) {
        await _0x5d887.error(_0x13e052 + "\nCommand:setcmd", _0x13e052);
      }
    }
  );
  astro_patch.cmd(
    {
      pattern: "delcmd",
      desc: "To check ping",
      category: "user",
      fromMe: true,
      filename: __filename,
    },
    async (_0xcfb3ed, _0x5c72db, { Void: _0x5c00fc }) => {
      try {
        let _0xf7499f = _0x5c72db
          ? _0x5c72db.split(" ")[0].trim().toLowerCase()
          : "";
        let _0x5dd184 = false;
        if (_0xcfb3ed.quoted) {
          if (_0xcfb3ed.quoted.mtype == "stickerMessage") {
            _0x5dd184 = true;
            _0xf7499f = "sticker-" + _0xcfb3ed.quoted.msg.fileSha256;
          } else if (!_0x5c72db) {
            return await _0xcfb3ed.send(
              "*_Please reply to a Sticker that set for a Cmd_*"
            );
          }
        } else if (!_0x5c72db) {
          return await _0xcfb3ed.send(
            "*_Uhh Dear, provide Name that set to a cmd_*\n*Eg: _.delcmd Cmd_Name_*"
          );
        }
        if (global.setCmdAlias[_0xf7499f]) {
          await _0xcfb3ed.send(
            '*_"' +
              (_0x5dd184 ? "Given Sticker" : _0xf7499f) +
              '" deleted Succesfully at "' +
              global.setCmdAlias[_0xf7499f] +
              '" cmd_*'
          );
          delete global.setCmdAlias[_0xf7499f];
          return;
        } else {
          return await _0xcfb3ed.send(
            '*_"' +
              (_0x5dd184 ? "Given Sticker" : _0xf7499f) +
              '" not Set for any cmd._*\n *_Please Provide Valid ' +
              (_0x5dd184 ? "Sticker" : "cmd Name") +
              " to delete_*"
          );
        }
      } catch (_0x2252fb) {
        await _0xcfb3ed.error(_0x2252fb + "\nCommand:delcmd", _0x2252fb);
      }
    }
  );