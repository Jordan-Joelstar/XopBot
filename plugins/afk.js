const { bot } = require("../lib/plugins");
const config = require("../config");
var AFK_DB = {
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
bot({ on: "text", fromMe: false }, async (message, match) => {
 if (AFK_DB.isAfk && !message.fromMe) {
  const afkText = "I'm currently away.";
  const reasonText = AFK_DB.reason ? `\n*Reason:* \`\`\`${AFK_DB.reason}\`\`\`` : "";
  const lastSeenText = AFK_DB.lastseen !== 0 ? `\n*Last seen:* \`\`\`${secondsToHms(Math.round(new Date().getTime() / 1000) - AFK_DB.lastseen)} ago\`\`\`` : "";

  if (message.isGroup && message.mention?.length && (message.mention?.includes(message.myjid + "@s.whatsapp.net") || message.mention?.includes(global.sudo?.split(",")[0] + "@s.whatsapp.net"))) {
   await message.reply(afkText + reasonText + lastSeenText);
  } else if (message.isGroup && message.reply_message && (message.reply_message.jid.split("@")[0] === message.myjid || message.reply_message.jid.split("@")[0] === global.sudo?.split(",")[0])) {
   await message.reply(afkText + reasonText + lastSeenText);
  } else if (!message.isGroup && !message.fromMe) {
   await message.reply(afkText + reasonText + lastSeenText);
  }
 }
});
bot({ on: "text", fromMe: true }, async (message, match) => {
 const handler = config.HANDLERS !== "false" ? config.HANDLERS.split("")[0] : "";
 if (AFK_DB.isAfk && !message.id.startsWith("3EB0") && (message.fromMe || message.sender.split("@")[0] === global.sudo?.split(",")[0])) {
  const buttons = [{ buttonId: handler + "afk disable_button", buttonText: { displayText: "Yes, disable afk" }, type: 1 }];
  const buttonMessage = {
   text: "*Looks like you are back online. Use '.afk disable' to disable afk*",
   footer: "AFK manager",
   buttons: buttons,
  };
  return await message.reply(buttonMessage.text);
 }
});

bot({ pattern: "afk", fromMe: true, desc: "Set your status as AFK." }, async (message, match) => {
 if (match[1] === "disable" && (message.fromMe || message.sender.split("@")[0] === global.sudo?.split(",")[0])) {
  AFK_DB.lastseen = 0;
  AFK_DB.reason = false;
  AFK_DB.isAfk = false;
  return await message.reply("You are no longer AFK.");
 } else if (!AFK_DB.isAfk) {
  AFK_DB.lastseen = Math.round(new Date().getTime() / 1000);
  if (match !== "") {
   AFK_DB.reason = match[1];
  }
  AFK_DB.isAfk = true;
  await message.send("You are now AFK." + (AFK_DB.reason !== false ? `\n*Reason:* \`\`\`${AFK_DB.reason}\`\`\`` : ""));
 }
});
