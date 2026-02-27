import { client } from '@/index.js';
import { SelectHandler } from '@/types/Command.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { Collection, Interaction } from 'discord.js';

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadSelects() {
	const logger = new Logger('Select Loader');
	logger.info('Start load selectors');
	client.selects = new Collection<string, SelectHandler>();

	const selectPath = path.join(import.meta.dirname, '');
	const entries = fs.readdirSync(selectPath, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const subdir = path.join(selectPath, entry.name);
		const selectsFiles = fs
			.readdirSync(subdir)
			.filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
			.map((f) => path.join(subdir, f));

		for (const file of selectsFiles) {
			const fileUrl = pathToFileURL(file).href;
			const select: SelectHandler = (await import(fileUrl)).default;

			logger.info(`Add selector: ${select.id}`);
			client.selects.set(select.id, select);
		}
	}

	logger.succes(`Added ${client.selects.size} selectors`);
}

export async function handleSelect(i: Interaction) {
	const logger = new Logger('select Handler');
	if (!i.isStringSelectMenu()) return;

	const select = client.selects.get(i.customId);
	if (!select) return;

	try {
		await select.execute(i);
	} catch (err) {
		logger.error(`Ошибка вызова функции селектора ${i.customId}: ${err}`);
		await safeReply(i, {
			content: 'Ошибка попробуйте позже.',
		});
	}
}
