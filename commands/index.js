const afkpanel = require('./afkpanel');
const inactivepanel = require('./inactivepanel');
const carparkpanel = require('./carparkpanel');

const commands = [afkpanel, inactivepanel, carparkpanel];

const commandData = commands.map((cmd) => cmd.data.toJSON());

const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));

module.exports = {
	commands,
	commandData,
	commandMap,
};
