import { Car } from '@/types/index.js';
import {
	StringSelectMenuOptionBuilder,
	StringSelectMenuBuilder,
	LabelBuilder,
	ModalBuilder,
} from 'discord.js';

export function createCarParkModal(freeCarsList: Car[]) {
	const options = freeCarsList.map((car: Car) =>
		new StringSelectMenuOptionBuilder()
			.setLabel(car.name)
			.setDescription(car.number)
			.setValue(car.id),
	);

	const select = new StringSelectMenuBuilder()
		.setCustomId('select_list_cars')
		.setPlaceholder('Выберите из списка')
		.addOptions(options);

	const selectLabel = new LabelBuilder()
		.setLabel('Выберите автомобиль')
		.setDescription(
			'Вы займете его на 2 часа, после чего бронирование нужно будет повторить!',
		)
		.setStringSelectMenuComponent(select);
	const modal = new ModalBuilder({
		customId: 'modal_carpark',
		title: 'Автопарк',
	});
	modal.addLabelComponents(selectLabel);
	return modal;
}
