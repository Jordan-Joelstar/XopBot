const config = require("../../config");
const { DataTypes } = require("sequelize");

const chatSchema = {
 type: DataTypes.STRING,
 allowNull: false,
};

const patternSchema = {
 type: DataTypes.TEXT,
 allowNull: false,
};

const textSchema = {
 type: DataTypes.TEXT,
 allowNull: false,
};

const regexSchema = {
 type: DataTypes.BOOLEAN,
 allowNull: false,
};

const filterSchema = {
 chat: chatSchema,
 pattern: patternSchema,
 text: textSchema,
 regex: regexSchema,
};

const Filter = config.DATABASE.define("filter", filterSchema);

const filterCache = {};

exports.setFilter = async (chat, pattern, text, regex) => {
 delete filterCache[chat];

 const existingFilter = await Filter.findAll({
  where: { chat, pattern },
 });

 if (existingFilter.length < 1) {
  return await Filter.create({ chat, pattern, text, regex });
 }

 return await existingFilter[0].update({ chat, pattern, text, regex });
};

exports.getFilter = async (chat) => {
 if (chat in filterCache) {
  return filterCache[chat];
 }

 const filters = await Filter.findAll({
  where: { chat },
 });

 if (filters.length < 1) {
  filterCache[chat] = false;
  return false;
 }

 filterCache[chat] = filters;
 return filters;
};

exports.deleteFilter = async (chat, pattern) => {
 delete filterCache[chat];

 const existingFilter = await Filter.findAll({
  where: { chat, pattern },
 });

 if (existingFilter.length < 1) {
  return false;
 }

 return await existingFilter[0].destroy();
};
