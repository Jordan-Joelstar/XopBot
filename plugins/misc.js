const { bot } = require("../lib");
const axios = require("axios");
const { mention, filter } = require("../lib/Asta");
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
bot(
 {
  pattern: "mention",
  fromMe: true,
  type: "chats",
  desc: "set auto reply for mention",
 },
 async (message, match) => {
  mention.cmd(message, match);
 }
);

bot(
 {
  on: "main",
  fromMe: false,
 },
 async (message, match = "") => {
  mention.check(message, match);
 }
);

bot(
 {
  pattern: "filter",
  type: "chats",
  desc: "set auto reply filter messages",
  fromMe: true,
 },
 async (message, match) => {
  filter.set(message, match);
 }
);

bot(
 {
  pattern: "fstop",
  type: "chats",
  desc: "stop auto reply from a word",
  fromMe: true,
 },
 async (message, match) => {
  filter.stop(message, match);
 }
);

bot(
 {
  pattern: "flist",
  type: "chats",
  desc: "get list of auto reply word",
  fromMe: true,
 },
 async (message) => {
  filter.list(message);
 }
);

bot(
 {
  on: "text",
 },
 async (message, match) => {
  try {
   filter.check(message, match);
  } catch (error) {}
 }
);
