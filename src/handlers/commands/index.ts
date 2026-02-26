import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { ChatInputCommandInteraction, Collection } from 'discord.js';
import Logger from '@/utils/logger.js';
import { client } from '@/index.js';
import { Command } from '@/types/Command.js';

export async function loadCommands() {
	const logger = new Logger('Commands Loader');
	logger.info('Start load commands');
	client.commands = new Collection();

	const commandsPath = path.join(import.meta.dirname, '');
	const entries = fs.readdirSync(commandsPath, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		let commandFiles: string[] = [];

		if (entry.isFile()) {
			commandFiles = [entry.name];
		} else if (entry.isDirectory()) {
			const subdir = path.join(commandsPath, entry.name);
			commandFiles = fs.readdirSync(subdir);
			commandFiles = commandFiles.map((f) => path.join(subdir, f));
		}

		for (const file of commandFiles) {
			if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

			const fileUrl = pathToFileURL(file).href;
			const command: Command = (await import(fileUrl)).default;
			logger.info(`Add command: ${command.data.name}`);

			client.commands.set(command.data.name, command);
		}
	}

	logger.succes(`Added ${client.commands.size} commands`);
}

export async function handleCommand(i: ChatInputCommandInteraction) {
	if (!i.isChatInputCommand) return;
	const command = client.commands.get(i.commandName);
	if (!command || typeof command.execute !== 'function') {
		return false;
	}
	await command.execute(i);
	return true;
}
