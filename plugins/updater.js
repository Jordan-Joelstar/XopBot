const DB = require("../lib/scraper");
const { Config, bot } = require("../lib");
const simpleGit = require("simple-git");
const git = simpleGit();

const isHeroku = process.env.HEROKU_API_KEY && process.env.HEROKU_APP_NAME;

async function updateHerokuApp() {
 if (!isHeroku) {
  console.log("Heroku environment variables not set. Skipping Heroku update.");
  return "Heroku update skipped. Environment variables not set.";
 }

 try {
  const Heroku = require("heroku-client");
  const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });

  await git.fetch();
  const commits = await git.log(["main..origin/main"]);

  if (commits.total === 0) {
   return `_Already on the latest version._`;
  }

  console.log("Update detected. Updating your Heroku app...");

  const app = await heroku.get(`/apps/${process.env.HEROKU_APP_NAME}`);
  const gitUrl = app.git_url.replace("https://", `https://api:${process.env.HEROKU_API_KEY}@`);

  try {
   await git.addRemote("heroku", gitUrl);
  } catch (error) {
   console.error("Error adding Heroku remote:", error);
  }

  await git.push("heroku", "main");
  return "Bot updated successfully. Restarting...";
 } catch (error) {
  console.error("Heroku update error:", error);
  return "Update failed. Please check your Heroku configuration.";
 }
}

bot(
 {
  pattern: "isupdate",
  desc: "Checks for available updates.",
  category: "tools",
  fromMe: true,
 },
 async (citel, text) => {
  try {
   const commits = await DB.syncgit();
   if (commits.total === 0) {
    return await citel.reply("_Latest Patch Installed");
   }

   const update = await DB.sync();
   await citel.bot.sendMessage(citel.chat, { text: update.replace(/Astro/, "AstroAnalytics") }, { quoted: citel });

   if (text === "start" && isHeroku) {
    await citel.reply("Starting update process...");
    const updateResult = await updateHerokuApp();
    return await citel.reply(updateResult);
   }
  } catch (error) {
   citel.error(`Error in checkupdate: ${error.message}`, error, "ERROR!");
  }
 }
);

bot(
 {
  pattern: "update",
  desc: "Updates Your Bot",
  fromMe: true,
  category: "tools",
 },
 async (citel) => {
  try {
   const commits = await DB.syncgit();
   if (commits.total === 0) {
    return await citel.reply(`_Already up to date._`);
   }

   const update = await DB.sync();
   await citel.bot.sendMessage(citel.jid, {
    text: `*UPDATE IN PROGRESS*\n${update}`,
   });

   await git.reset("hard", ["HEAD"]);
   await git.pull();

   const successMessage = "_Updated, Restart Your Bot_";

   await citel.reply(successMessage);
  } catch (error) {
   citel.error(`Error in update: ${error.message}`, error);
  }
 }
);

// Check for auto-update on Heroku
if (isHeroku) {
 console.log("HEROKU: Checking for auto-update...");
 updateHerokuApp().then(console.log).catch(console.error);
}
