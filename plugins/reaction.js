/**
 * Thanks @SamPandey001 for this
 */
const { bot, animeReact } = require("../lib");
bot(
  { pattern: "poke", category: "reaction", desc: "send Anime poke reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "poked to", "poked to everyone.");
  },
);

bot(
  { pattern: "hug", category: "reaction", desc: "send Anime hug reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "hug to", "hug with everyone.");
  },
);

bot(
  {
    pattern: "hold",
    category: "reaction",
    desc: "send Anime hand hold reaction.",
  },
  async (bot) => {
    await animeReact(
      bot,
      "handhold",
      "hold hand of",
      "holded hand of everyone",
    );
  },
);

bot(
  { pattern: "hifi", category: "reaction", desc: "send Anime hifi reaction." },
  async (bot) => {
    await animeReact(
      bot,
      "highfive",
      "highfive with",
      "highfive with everyone.",
    );
  },
);

bot(
  { pattern: "bite", category: "reaction", desc: "send Anime bite reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "bitten to", "bitten to everyone.");
  },
);

bot(
  {
    pattern: "blush",
    category: "reaction",
    desc: "send Anime blush reaction.",
  },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "blushed to", "blushed to everyone.");
  },
);

bot(
  {
    pattern: "punch",
    category: "reaction",
    desc: "send Anime punch reaction.",
  },
  async (bot) => {
    await animeReact(bot, "kick", "punched to", "punched everyone.");
  },
);

bot(
  { pattern: "pat", category: "reaction", desc: "send Anime pated reaction." },
  async (bot, { cmdName }) => {
    await animeReact(
      bot,
      cmdName,
      "patted with",
      "patted with everyone.",
    );
  },
);

bot(
  { pattern: "kiss", category: "reaction", desc: "send Anime kiss reaction." },
  async (bot, { cmdName }) => {
    await animeReact(
      bot,
      cmdName,
      "kissed with",
      "kissed with everyone.",
    );
  },
);

bot(
  { pattern: "kill", category: "reaction", desc: "send Anime kill reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "kill ", "kill everyone over here");
  },
);

bot(
  {
    pattern: "happy",
    category: "reaction",
    desc: "send Anime happy reaction.",
  },
  async (bot) => {
    await animeReact(
      bot,
      "dance",
      "feel happy with",
      "feel happy with everyone",
    );
  },
);

bot(
  {
    pattern: "dance",
    category: "reaction",
    desc: "send Anime dance reaction.",
  },
  async (bot, { cmdName }) => {
    await animeReact(
      bot,
      cmdName,
      "dance with",
      "dance with everyone over here",
    );
  },
);

bot(
  { pattern: "yeet", category: "reaction", desc: "send Anime yeet reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "yeeted to", "yeeted with everyone");
  },
);

bot(
  { pattern: "wink", category: "reaction", desc: "send Anime wink reaction." },
  async (bot, { cmdName }) => {
    await animeReact(
      bot,
      cmdName,
      "winked with",
      "winked with everyone",
    );
  },
);

bot(
  { pattern: "slap", category: "reaction", desc: "send Anime slap reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "slap to", "slap to everyone");
  },
);

bot(
  { pattern: "bonk", category: "reaction", desc: "send Anime bonk reaction." },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "bonked to", "bonked to everyone");
  },
);

bot(
  {
    pattern: "bully",
    category: "reaction",
    desc: "send Anime bully reaction.",
  },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "bullied to", "bullied to everyone");
  },
);

bot(
  {
    pattern: "cringe",
    category: "reaction",
    desc: "send Anime cringe reaction.",
  },
  async (bot, { cmdName }) => {
    await animeReact(bot, cmdName, "cringed to", "cringed to everyone");
  },
);

bot(
  {
    pattern: "cuddle",
    category: "reaction",
    desc: "send Anime cuddle reaction.",
  },
  async (bot, { cmdName }) => {
    await animeReact(
      bot,
      cmdName,
      "cuddled with",
      "cuddled with everyone",
    );
  },
);
