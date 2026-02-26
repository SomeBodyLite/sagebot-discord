import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { client } from '@/index.js';
import { ButtonHandler } from '@/types/Command.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { Collection, Interaction } from 'discord.js';

export async function loadButtons() {
	const logger = new Logger('Buttons Loader');
	client.buttons = new Collection<string, ButtonHandler>();

	const buttonsPath = path.join(import.meta.dirname, '');
	const entries = fs.readdirSync(buttonsPath, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const subdir = path.join(buttonsPath, entry.name);
		const buttonFiles = fs
			.readdirSync(subdir)
			.filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
			.map((f) => path.join(subdir, f));

		for (const file of buttonFiles) {
			const fileUrl = pathToFileURL(file).href;
			const button: ButtonHandler = (await import(fileUrl)).default;

			logger.info(`Add button: ${button.id}`);
			client.buttons.set(button.id, button);
		}
	}

	logger.succes(`Added ${client.buttons.size} buttons`);
}

export async function handleButton(i: Interaction) {
	const logger = new Logger('Button Handler');
	if (!i.isButton()) return;

	const button = client.buttons.get(i.customId);
	if (!button) return;

	try {
		await button.execute(i);
	} catch (err) {
		logger.error(`Ошибка вызова функции кнопки ${i.customId}: ${err}`);
		await safeReply(i, {
			content: 'Ошибка попробуйте позже.',
		});
	}
}
