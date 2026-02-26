import { client } from '@/index.js';
import { ModalHandler } from '@/types/Command.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { Collection, Interaction } from 'discord.js';

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadModals() {
	const logger = new Logger('Modals Loader');
	logger.info('Start load modals');
	client.modals = new Collection<string, ModalHandler>();

	const modalPath = path.join(import.meta.dirname, '');
	const entries = fs.readdirSync(modalPath, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const subdir = path.join(modalPath, entry.name);
		const modalsFiles = fs
			.readdirSync(subdir)
			.filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
			.map((f) => path.join(subdir, f));

		for (const file of modalsFiles) {
			const fileUrl = pathToFileURL(file).href;
			const modal: ModalHandler = (await import(fileUrl)).default;

			logger.info(`Add Modal: ${modal.id}`);
			client.modals.set(modal.id, modal);
		}
	}

	logger.succes(`Added ${client.modals.size} modals`);
}

export async function handleModal(i: Interaction) {
	const logger = new Logger('Modal Handler');
	if (!i.isModalSubmit()) return;

	const modal = client.modals.get(i.customId);
	if (!modal) return;

	try {
		await modal.execute(i);
	} catch (err) {
		logger.error(
			`Ошибка вызова функции модального окна ${i.customId}: ${err}`,
		);
		await safeReply(i, {
			content: 'Ошибка попробуйте позже.',
		});
	}
}
