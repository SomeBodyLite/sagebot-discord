import { Client, Interaction } from 'discord.js';
import { ConfigType } from '../config.js';
import { AfkRepository } from '../repositories/afkRepository.js';
import { InactiveRepository } from '../repositories/inactiveRepository.js';
import { CarParkRepository } from '../repositories/carParkRepository.js';

export async function handleStringSelectMenu(
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
