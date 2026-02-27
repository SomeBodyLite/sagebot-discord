import { carParkRepository } from '@/repositories/carParkRepository.js';
import { updateAdminCarParkPanel } from '@/ui/panels/car-park-admin.js';
import { updateCarParkPanel } from '@/ui/panels/car-park.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { bold, ModalSubmitInteraction, SelectMenuModalData } from 'discord.js';

async function execute(i: ModalSubmitInteraction) {
	const logger = new Logger('Delete Car Modal Handler');

	const selectedCar = i.fields.fields.get(
		'select_car_for_delete',
	) as SelectMenuModalData;
	const carId = selectedCar.values[0];
	try {
		const car = await carParkRepository.remove(carId);
		logger.succes(`Car with id ${carId} deleted`);
		safeReply(i, {
			content: `\nМашина удалена: \n${bold('Название')}: ${car?.name}\n${bold('Номер')}: ${car?.number}}`,
		});
		updateCarParkPanel();
		updateAdminCarParkPanel();
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Ошибка удаления автомобиля: ${error.message}`);
			safeReply(i, {
				content: error.message,
			});
		} else {
			logger.error('Неизвестная ошибка удаления автомобиля');
			safeReply(i, {
				content: 'Произошла неизвестная ошибка',
			});
		}
	}
}

export default {
	id: 'modal_delete_car',
	execute: execute,
};
