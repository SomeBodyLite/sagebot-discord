import { Client, REST, Routes } from 'discord.js';
import { TOKEN } from '../config.js';

export async function registerGuildCommands({
	clientId,
	guildId,
	client,
}: {
	clientId?: string;
	guildId?: string;
	client: Client;
}) {
	if (!TOKEN || !clientId || !guildId) {
		console.log('TOKEN', TOKEN);
		console.log('clientId', clientId);
		console.log('guildId', guildId);
		throw new Error('Не достаточно данных для регистрации команд!');
	}
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	const commandData = client.commands.map((cmd) => cmd.data.toJSON());

	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandData,
		});
		console.info('Commands registrate!');
	} catch (e) {
		console.log('Command registration error:', e);
	}
}
