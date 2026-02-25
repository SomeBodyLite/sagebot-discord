import { Client, Interaction } from 'discord.js';
import { ConfigType } from '../config';
import { AfkRepository } from '../repositories/afkRepository';
import { InactiveRepository } from '../repositories/inactiveRepository';
import { CarParkRepository } from '../repositories/carParkRepository';

const { handleButton } = require('./buttons');
const { handleModal } = require('./modals');
const { safeReply } = require('../utils/safeReply');
const { commandMap } = require('../commands');
const { handleStringSelectMenu } = require('./selectMenu');

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
	return async (i: Interaction) => {
		try {
			if (i.isChatInputCommand()) {
				const command = commandMap.get(i.commandName);
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
			console.log('interaction handler error:', e);
			await safeReply(i, {
				content: 'Произошла ошибка. Попробуйте ещё раз позже.',
			});
			return true;
		}
	};
}
