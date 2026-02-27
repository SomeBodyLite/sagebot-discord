import { carParkRepository } from '@/repositories/carParkRepository.js';
import { Car } from '@/types/index.js';
import {
	ModalBuilder,
	StringSelectMenuOptionBuilder,
	StringSelectMenuBuilder,
	LabelBuilder,
} from 'discord.js';

export async function deleteCarModal() {
	const cars = await carParkRepository.getAll();

	const options = cars.map((car: Car) =>
		new StringSelectMenuOptionBuilder()
			.setLabel(car.name)
			.setDescription(car.number)
			.setValue(car.id),
	);

	const selectCar = new LabelBuilder()
		.setLabel('Выберите автомобиль')
		.setDescription('Вы безвозвратно удалите автомобиль!')
		.setStringSelectMenuComponent(
			new StringSelectMenuBuilder()
				.setCustomId('select_car_for_delete')
				.setPlaceholder('Выберите из списка')
				.addOptions(options),
		);

	const modal = new ModalBuilder({
		components: [selectCar],
		customId: 'modal_delete_car',
		title: 'Удалить Автомобиль',
	});
	return modal;
}
