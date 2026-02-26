import { Client, REST, Routes } from 'discord.js';
import { TOKEN } from '../config.js';
import Logger from '../utils/logger.js';

export async function registerGuildCommands({
	clientId,
	guildId,
	client,
}: {
	clientId?: string;
	guildId?: string;
	client: Client;
}) {
	const logger = new Logger('Commands Registrator');
	if (!TOKEN || !clientId || !guildId) {
		logger.error(`Не достаточно данных для регистрации команд!`);
		logger.info(
			`\nTOKEN : ${TOKEN}\nclientId : ${clientId}\nguildId : ${guildId}\n`,
		);
		throw new Error();
	}
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	const commandData = client.commands.map((cmd) => cmd.data.toJSON());

	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandData,
		});
		logger.succes('Commands registrate!');
	} catch (e) {
		logger.error(`Command registration error: ${e}`);
	}
}
