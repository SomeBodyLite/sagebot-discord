const afkpanel = require('./afkpanel');
const inactivepanel = require('./inactivepanel');

const commands = [afkpanel, inactivepanel];

const commandData = commands.map((cmd) => cmd.data.toJSON());

const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));

module.exports = {
	commands,
	commandData,
	commandMap,
};
