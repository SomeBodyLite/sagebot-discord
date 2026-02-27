import { carParkRepository } from '@/repositories/carParkRepository.js';
import { changeCarModal } from '@/ui/modals/car-park/change-car.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { StringSelectMenuInteraction } from 'discord.js';

async function execute(i: StringSelectMenuInteraction) {
	const logger = new Logger('Change Car Select Handler');

	const selectedCarId = i.values[0];
	const car = await carParkRepository.get(selectedCarId);
	if (!car) {
		await safeReply(i, {
			content: 'Возникла ошибка, id такого автомобиля нет',
		});
		logger.error(`Такого автомобиля нет\n ID:${selectedCarId}`);
		return;
	}

	await i.showModal(changeCarModal(car));
	await i.editReply({
		components: [],
		content: 'Модальное окно для изменения вызвано',
	});
}

export default {
	id: 'select_change_car',
	execute: execute,
};
