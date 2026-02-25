import { Client, Interaction } from 'discord.js';
import { ConfigType } from '../config';
import { AfkRepository } from '../repositories/afkRepository';
import { InactiveRepository } from '../repositories/inactiveRepository';
import { CarParkRepository } from '../repositories/carParkRepository';

const { safeReply } = require('../utils/safeReply');

async function handleStringSelectMenu(
	i: Interaction,
	{
		client,
		config,
		afkRepo,
		inactiveRepo,
		carParkRepo,
		updateAfkPanel,
		updateInactivePanel,
		updateCarParkPanel,
	}: {
		client: Client;
		config: ConfigType;
		afkRepo: AfkRepository;
		inactiveRepo: InactiveRepository;
		carParkRepo: CarParkRepository;
		updateAfkPanel: () => Promise<void>;
		updateInactivePanel: () => Promise<void>;
		updateCarParkPanel: () => Promise<void>;
	},
) {
	if (!i.isStringSelectMenu()) return false;
}

module.exports = { handleStringSelectMenu };
