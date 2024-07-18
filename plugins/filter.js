const { bot } = require("../lib");
const { mention, filter } = require("../lib/Asta");
bot(
 {
  pattern: "mention",
  fromMe: true,
  type: "filter",
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
  type: "filter",
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
  type: "filter",
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
  type: "filter",
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
