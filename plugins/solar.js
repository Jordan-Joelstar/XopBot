const { smd, sleep } = require("../lib");

const regex = /#asta|#love|#cute|#luv|#world|#moon|#teddy|#hrt|#joy|#sad|#angry|#shy|#conf|#bored|#frust/g;
const defaultEmoji = "#asta";

smd(
 {
  pattern: "emo1",
  type: "emos",
  info: "sending hearts",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["💖", "💗", "💕", "🩷", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "❤️‍🔥", "💞", "💓", "💘", "💝", "♥️", "💟", "❤️‍🩹", "❤️"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(800);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo2",
  type: "emos",
  info: "sending joyful emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😃", "😄", "😁", "😊", "😎", "🥳", "😸", "😹", "🌞", "🌈"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(500);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo3",
  type: "emos",
  info: "sending sad emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["🥺", "😟", "😕", "😖", "😫", "🙁", "😩", "😥", "😓", "😪", "😢", "😔", "😞", "😭", "💔", "😭", "😿"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(700);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo4",
  type: "emos",
  info: "sending angry emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😡", "😠", "🤬", "😤", "😾", "😡", "😠", "🤬", "😤", "😾"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(500);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo5",
  type: "emos",
  info: "sending shy emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😳", "😊", "😶", "🙈", "🙊", "😳", "😊", "😶", "🙈", "🙊"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(500);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo6",
  type: "emos",
  info: "sending confused emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😕", "😟", "😵", "🤔", "😖", "😲", "😦", "🤷", "🤷‍♂️", "🤷‍♀️"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(500);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo7",
  type: "emos",
  info: "sending bored emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😑", "😐", "😒", "😴", "😞", "😔", "😕", "🙁", "😩", "😫", "😖"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(800);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo8",
  type: "emos",
  info: "sending frustrated emojis",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["😤", "😡", "😠", "🤬", "😖", "😒", "😩", "😤", "😡", "😠"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (const emoji of emojis) {
   await sleep(800);
   await client.send(emojiText.replace(regex, "" + emoji), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo9",
  type: "emos",
  info: "sending hearts emojis with your text",
 },
 async (client, message) => {
  let emojiText = regex.test(message) ? message : defaultEmoji;

  const emojis = ["❤️", "💕", "😻", "🧡", "💛", "💚", "💙", "💜", "🖤", "❣️", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💌", "🙂", "🤗", "😌", "😉", "🤗", "😊", "🎊", "🎉", "🎁", "🎈"];

  const { key } = await client.send(emojiText.replace(regex, "" + emojis[0]));

  for (let i = 0; i < emojis.length; i++) {
   await sleep(800);
   await client.send(emojiText.replace(regex, "" + emojis[i]), { edit: key });
  }
 }
);
smd(
 {
  pattern: "emo10",
  type: "emos",
  info: "send world emojis with your text",
 },
 async (client, message) => {
  if (!regex.test(message)) {
   await client.send("*_Please provide text with #world_*\n> *_" + prefix + "world hii Sweet Heart, #love_*");
   return;
  }

  const emojis = ["🌏", "🌍", "🌎"];

  const { key } = await client.send(message.replace(regex, "" + emojis[0]));

  for (let i = 0; i < 15; i++) {
   await sleep(700);
   await client.send(message.replace(regex, "" + emojis[Math.floor(Math.random() * emojis.length)]), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo11",
  type: "emos",
  info: "Shows moon system emojis",
 },
 async (message, text) => {
  const moonPhases = [
   "🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗",
   "🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘",
   "🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑",
   "🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒",
   "🌓🌓🌓🌓🌓\n🌓🌓🌓🌓🌓\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓",
   "🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔",
   "🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕",
   "🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖",
   "🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗",
   "🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘",
   "🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑",
   "🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒",
   "🌓🌓🌓🌓🌓\n🌓🌓🌓🌓🌓\n🌓🌓🌓🌓🌓\n🌗🌗🌗🌗🌗\n🌓🌓🌓🌓🌓",
   "🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔\n🌘🌘🌘🌘🌘\n🌔🌔🌔🌔🌔",
   "🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕\n🌑🌑🌑🌑🌑\n🌕🌕🌕🌕🌕",
   "🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖\n🌒🌒🌒🌒🌒\n🌖🌖🌖🌖🌖",
  ];

  const regex = /asta/; // Replace with your actual regex pattern
  const matchText = regex.test(text) ? text : "asta";

  const { key } = await message.send(matchText.replace(regex, "\n```" + moonPhases[0] + "```\n"));

  for (let i = 1; i < moonPhases.length; i++) {
   await sleep(800);
   await message.send(matchText.replace(regex, "\n```" + moonPhases[i] + "```\n").trim(), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo12",
  type: "emos",
  info: "Show moon emojis edits with your text",
 },
 async (message, text) => {
  const moonEmojis = ["🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖"];
  if (!regex.test(text)) {
   await message.send("*_Please provide text with #moon_*\n> *_" + prefix + "world hii Sweet Heart, #cute_*");
   return;
  }

  const { key } = await message.send(text.replace(regex, "" + moonEmojis[0]));

  for (let i = 0; i < moonEmojis.length; i++) {
   await sleep(700);
   await message.send(text.replace(regex, "" + moonEmojis[i]), { edit: key });
  }
 }
);

smd(
 {
  pattern: "emo13",
  type: "emos",
  info: "Hand practice edits, 18+",
 },
 async (message, text) => {
  const handEmojis = ["8✊️===D", "8=✊️==D", "8==✊️=D", "8===✊️D", "8==✊️=D", "8=✊️==D", "8✊️===D", "8=✊️==D", "8==✊️=D", "8===✊️D", "8==✊️=D", "8=✊️==D", "8✊️===D", "8=✊️==D", "8==✊️=D", "8===✊️D", "8==✊️=D", "8=✊️==D", "8✊️===D", "8=✊️==D", "8==✊️=D", "8===✊️D 💦", "8==✊️=D💦 💦", "8=✊️==D 💦💦 💦"];
  const matchText = regex.test(text) ? text : "asta";

  const { key } = await message.send(matchText.replace(regex, "" + handEmojis[0]));

  for (let i = 1; i < handEmojis.length; i++) {
   await sleep(300);
   await message.send(matchText.replace(regex, "" + handEmojis[i]).trim(), { edit: key });
  }
 }
);
