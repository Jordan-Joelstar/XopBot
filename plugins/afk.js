const { bot } = require("../lib/index");
const fs = require("fs-extra");

let db = {};

db.get = async () => {
 const filePath = "./lib/tmp/afk.json";
 try {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
 } catch (error) {
  return {};
 }
};

db.update = async (newData) => {
 try {
  const filePath = "./afk.json";
  const currentData = await db.get();
  const updatedData = { ...currentData, ...newData };
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");
  return updatedData;
 } catch (error) {
  console.error("Error updating data:", error);
 }
};

let afk = false;

const afkMessage = `
🌟 Hey there! I'm currently away from my keyboard. 🌟

Feel free to leave a message, and I'll get back to you as soon as I can.

Thank you for your patience! 😊

🕒 Last seen: @lastseen
🔔 I'll be back soon!

Take care! 💻
`;

bot(
 {
  pattern: "afk",
  desc: "away from keyboard",
  category: "chats",
 },
 async (message) => {
  try {
   let data = await db.get();
   afk = data.afk || { users: {} };

   afk[message.sender] = { lastseen: new Date() };
   data.afk = { ...afk };
   data = await db.update(data);

   if (data) {
    const response = afkMessage.replace("@lastseen", getTimeDifference(afk[message.sender].lastseen));
    await message.reply(response);
   } else {
    message.reply("*Request Denied!*");
   }
  } catch (error) {
   message.error(`${error}\n\nCommand: AFK`, error);
  }
 }
);

bot(
 {
  pattern: "unafk",
  desc: "turn off away from keyboard",
  category: "chats",
 },
 async (message) => {
  try {
   let data = await db.get();
   afk = data.afk || {};

   if (!afk[message.sender]) {
    return message.reply("*You are not AFK.*");
   }

   delete afk[message.sender];
   data.afk = { ...afk };
   data = await db.update(data);

   if (data) {
    await message.reply("Finally, You are back!");
   } else {
    message.reply("*Request Denied!*");
   }
  } catch (error) {
   message.error(`${error}\n\nCommand: UnAFK`, error, "ERROR");
  }
 }
);

const messages = {
 2: "*Hey I already informed you!*\n",
 3: "*Stop spamming!*",
};

function getTimeDifference(previousTime) {
 const previousDate = new Date(previousTime);
 const currentDate = new Date();
 const timeDifference = currentDate - previousDate;
 const days = Math.floor(timeDifference / 86400000);
 const hours = Math.floor((timeDifference % 86400000) / 3600000);
 const minutes = Math.floor((timeDifference % 3600000) / 60000);

 return `${days ? "Days " + days + ", " : ""}Hours ${hours || 0}, Minutes ${minutes || 0}`;
}

bot(
 {
  on: "main",
 },
 async (message) => {
  if (message.fromMe || message.isBot) return;

  try {
   if (!afk) {
    let data = await db.get();
    afk = data.afk || { users: [] };
   }

   const isReplyFromMe = message.reply_message && message.reply_message.fromMe;
   let mentionedUsers = message.mentionedJid[0] ? [...message.mentionedJid] : [];

   if (message.reply_message) {
    mentionedUsers.push(message.reply_message.sender);
   }

   for (const user of mentionedUsers) {
    if (afk[user] && message.sender !== user) {
     afk[user].users[message.sender] = (afk[user].users[message.sender] || 0) + 1;

     if (afk[user].users[message.sender] > 3) continue;

     const warning = messages[afk[user].users[message.sender]];
     const response = afkMessage.replace("@lastseen", `Last seen: ${getTimeDifference(afk[user].lastseen)}`);

     await message.reply(response);
    }
   }
  } catch (error) {
   console.log("ERROR IN AFK MAIN\n", error);
  }
 }
);
