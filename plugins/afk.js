const { bot } = require("../lib/");

var AFK = {
 isAfk: false,
 reason: false,
 lastseen: 0,
};

function secondsToHms(d) {
 d = Number(d);
 var h = Math.floor(d / 3600);
 var m = Math.floor((d % 3600) / 60);
 var s = Math.floor((d % 3600) % 60);

 var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
 var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
 var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
 return hDisplay + mDisplay + sDisplay;
}

bot(
 {
  on: "text",
  fromMe: false,
 },
 async (message, match) => {
  const afkText = "I'm currently AFK.";
  const reasonText = AFK.reason !== false ? `\n*Reason:* \`\`\`${AFK.reason}\`\`\`` : "";
  const lastSeenText = AFK.lastseen !== 0 ? `\n*Last seen:* \`\`\`${secondsToHms(Math.round(new Date().getTime() / 1000) - AFK.lastseen)} ago\`\`\`` : "";

  if (AFK.isAfk && (!message.jid.includes("@g.us") || (message.jid.includes("@g.us") && (message.mention?.length !== 0 || message.reply_message !== false)))) {
   if (message.jid.includes("@g.us") && message.mention?.length !== 0) {
    message.mention.map(async (jid) => {
     if (message.client.user.jid.split("@")[0] === jid.split("@")[0]) {
      await message.send(afkText + reasonText + lastSeenText, {
       quoted: message.data,
      });
     }
    });
   } else if (message.jid.includes("@g.us") && message.reply_message !== false) {
    if (message.reply_message.jid.split("@")[0] === message.client.user.jid.split("@")[0]) {
     await message.send(afkText + reasonText + lastSeenText, {
      quoted: message.data,
     });
    }
   } else {
    await message.send(afkText + reasonText + lastSeenText, {
     quoted: message.data,
    });
   }
  }
 }
);

bot(
 {
  on: "text",
  fromMe: true,
 },
 async (message, match) => {
  if (AFK.isAfk && !message.id.startsWith("3EB0")) {
   AFK.lastseen = 0;
   AFK.reason = false;
   AFK.isAfk = false;
   await message.send("You are no longer AFK.");
  }
 }
);

bot(
 {
  pattern: "afk",
  fromMe: true,
  desc: "Set your status as AFK.",
 },
 async (message, match) => {
  if (!AFK.isAfk) {
   AFK.lastseen = Math.round(new Date().getTime() / 1000);
   if (match !== "") {
    AFK.reason = match;
   }
   AFK.isAfk = true;

   await message.send("You are now AFK." + (AFK.reason !== false ? `\n*Reason:* \`\`\`${AFK.reason}\`\`\`` : ""));
  }
 }
);
