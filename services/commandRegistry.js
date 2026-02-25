const { REST, Routes } = require('discord.js');

async function registerGuildCommands({
	token,
	clientId,
	guildId,
	commandData,
}) {
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandData,
		});
	} catch (e) {
		console.log('Command registration error:', e);
	}
}

module.exports = {
	registerGuildCommands,
};

