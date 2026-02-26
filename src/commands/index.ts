import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Command } from '../types/Command.js';
import { Client, Collection } from 'discord.js';

export async function loadCommands(client: Client) {
	client.commands = new Collection();

	const commandsPath = path.join(import.meta.dirname, ''); // src/commands
	const entries = fs.readdirSync(commandsPath, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue; // пропускаем файлы

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
			console.log('Add command: ' + command.data.name);

			client.commands.set(command.data.name, command);
		}
	}

	console.log(`Added ${client.commands.size} commands`);
}
