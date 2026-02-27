import {
	ActionRowBuilder,
	ButtonInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';

import { carParkRepository } from '@/repositories/carParkRepository.js';
import { safeReply } from '@/utils/safeReply.js';

async function execute(i: ButtonInteraction) {
	const cars = await carParkRepository.getAll();

	const options = cars.map((car) =>
		new StringSelectMenuOptionBuilder()
			.setLabel(car.name)
			.setDescription(car.number)
			.setValue(car.id),
	);
	const carSelector = new StringSelectMenuBuilder()
		.setCustomId('select_change_car')
		.setPlaceholder('Выберите авто')
		.addOptions(options);

	const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		carSelector,
	);

	await safeReply(i, {
		content: 'Выберите автомобиль для редактирования',
		components: [row],
	});
}

export default {
	id: 'admin_change_car',
	execute: execute,
};
