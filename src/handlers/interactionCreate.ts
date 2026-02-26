import Logger from '@/utils/logger.js';
import { Interaction } from 'discord.js';
import { handleButton } from './buttons/index.js';
import { handleModal } from './modals/index.js';
import { safeReply } from '@/utils/safeReply.js';
import { handleCommand } from './commands/index.js';

export function createInteractionHandler() {
	const logger = new Logger('Create Interaction Handler');
	return async (i: Interaction) => {
		try {
			if (i.isChatInputCommand()) return await handleCommand(i);
			if (i.isButton()) return await handleButton(i);
			if (i.isModalSubmit()) return await handleModal(i);
			return false;
		} catch (e) {
			logger.error(`interaction handler error: ${e}`);
			await safeReply(i, {
				content: 'Произошла ошибка. Попробуйте ещё раз позже.',
			});
			return true;
		}
	};
}
