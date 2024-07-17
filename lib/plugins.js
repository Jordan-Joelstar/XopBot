let commands = [];

function Index(commandDetails, commandFunction) {
  let command = { ...commandDetails };
  command.function = commandFunction;

  command.pattern = command.pattern || commandDetails.cmdname;
  command.alias = command.alias || [];
  command.dontAddCommandList = command.dontAddCommandList || false;
  command.desc = command.desc || commandDetails.info || "";
  command.fromMe = command.fromMe || false;
  command.category = command.category || commandDetails.type || "misc";
  command.info = command.desc;
  command.type = command.category;
  command.use = command.use || "";
  command.filename = command.filename || "Not Provided";

  commands.push(command);
  return command;
}

const bot = Index;
const smd = bot
module.exports = {
  Index,
  bot,
  smd,
  commands: commands,
};
