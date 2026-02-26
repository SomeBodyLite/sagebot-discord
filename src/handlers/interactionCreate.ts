import { Client, Interaction } from 'discord.js';
import { ConfigType } from '../config.js';
import { AfkRepository } from '../repositories/afkRepository.js';
import { InactiveRepository } from '../repositories/inactiveRepository.js';
import { CarParkRepository } from '../repositories/carParkRepository.js';
import { handleStringSelectMenu } from './selectMenu.js';
import { handleButton } from './buttons.js';
import { handleModal } from './modals.js';
import { safeReply } from '../utils/safeReply.js';
import Logger from '../utils/logger.js';

interface Deps {
	client: Client;
	config: ConfigType;
	afkRepo: AfkRepository;
	inactiveRepo: InactiveRepository;
	carParkRepo: CarParkRepository;
	updateAfkPanel: () => Promise<void>;
	updateInactivePanel: () => Promise<void>;
	updateCarParkPanel: () => Promise<void>;
}
export function createInteractionHandler(deps: Deps) {
	const logger = new Logger('Create Interaction Handler');
	return async (i: Interaction) => {
		try {
			if (i.isChatInputCommand()) {
				const command = i.client.commands.get(i.commandName);
				if (!command || typeof command.execute !== 'function') {
					return false;
				}
				await command.execute(i, deps);
				return true;
			}
			if (i.isButton()) return await handleButton(i, deps);
			if (i.isModalSubmit()) return await handleModal(i, deps);
			if (i.isStringSelectMenu())
				return await handleStringSelectMenu(i, deps);
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
