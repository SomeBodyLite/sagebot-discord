const { REST, Routes } = require('discord.js');

export async function registerGuildCommands({
	token,
	clientId,
	guildId,
	commandData,
}: {
	token?: string;
	clientId?: string;
	guildId?: string;
	commandData: any;
}) {
	if (!token) {
		throw new Error('Нет токена!');
	}
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandData,
		});
	} catch (e) {
		console.log('Command registration error:', e);
	}
}
