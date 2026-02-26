import { REST, Routes } from 'discord.js';
import Logger from '../utils/logger.js';
import { config } from '../config.js';
import { client } from '../index.js';

export async function registerGuildCommands() {
	const logger = new Logger('Commands Registrator');
	if (!config.token || !config.clientId || !config.guildId) {
		logger.error(`Не достаточно данных для регистрации команд!`);
		logger.info(
			`\nTOKEN : ${config.token}\nclientId : ${config.clientId}\nguildId : ${config.guildId}\n`,
		);
		throw new Error();
	}
	const rest = new REST({ version: '10' }).setToken(config.token);
	const commandData = client.commands.map((cmd) => cmd.data.toJSON());

	try {
		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{
				body: commandData,
			},
		);
		logger.succes('Commands registered!');
	} catch (e) {
		logger.error(`Command registration error: ${e}`);
	}
}
