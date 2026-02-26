import { REST, Routes } from 'discord.js';
import Logger from '../utils/logger.js';
import { clientId, guildId, token } from '../config.js';
import { client } from '../index.js';

export async function registerGuildCommands() {
	const logger = new Logger('Commands Registrator');
	if (!token || !clientId || !guildId) {
		logger.error(`Не достаточно данных для регистрации команд!`);
		logger.info(
			`\nTOKEN : ${token}\nclientId : ${clientId}\nguildId : ${guildId}\n`,
		);
		throw new Error();
	}
	const rest = new REST({ version: '10' }).setToken(token);
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
