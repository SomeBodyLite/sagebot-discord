import { carParkRepository } from '@/repositories/carParkRepository.js';
import { updateAdminCarParkPanel } from '@/ui/panels/car-park-admin.js';
import { updateCarParkPanel } from '@/ui/panels/car-park.js';
import Logger from '@/utils/logger.js';
import { safeReply } from '@/utils/safeReply.js';
import { isValidLength } from '@/utils/validators.js';
import {
	bold,
	inlineCode,
	ModalSubmitInteraction,
	SelectMenuModalData,
	TextInputModalData,
} from 'discord.js';
import { getRolesForCar } from './create-car.js';

async function execute(i: ModalSubmitInteraction) {
	const logger = new Logger('Update Car Modal Handler');
	const [_, carIdRaw] = i.customId.split(':');
	const name = i.fields.fields.get('name') as TextInputModalData;
	const numberData = i.fields.fields.get('number') as TextInputModalData;
	const selectedRole = i.fields.fields.get(
		'select_role_for_car',
	) as SelectMenuModalData;

	const carId = carIdRaw.split('_')[1];
	const number = numberData.value.trim();

	if (!isValidLength(number, { max: 2, min: 2 })) {
		safeReply(i, {
			content: 'Введите только две последние цифры номера!',
		});
		return;
	}

	const roles = getRolesForCar(selectedRole.values[0]);
	try {
		const car = await carParkRepository.get(carId);
		if (!car) {
			await safeReply(i, {
				content: 'Возникла ошибка, id такого автомобиля нет',
			});
			logger.error(`Такого автомобиля нет\n ID:${carId}`);
			return;
		}

		await carParkRepository.update(carId, {
			id: carId,
			name: name.value,
			number: `SAGEXX${number}`,
			roles: roles,
			taked_At: car.taked_At,
			who_take: car.who_take,
		});

		logger.succes(`Car updated: Name: ${name.value}, Number:${number}`);
		safeReply(i, {
			content: `\nМашина обновлена: \n${bold('Название')}: ${name.value}\n${bold('Номер')}: ${number}\n${bold('Роли')}: ${inlineCode(roles.join(', '))}`,
		});
		updateCarParkPanel();
		updateAdminCarParkPanel();
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Ошибка обновления автомобиля: ${error.message}`);
			safeReply(i, {
				content: error.message,
			});
		} else {
			logger.error('Неизвестная ошибка обновления автомобиля');
			safeReply(i, {
				content: 'Произошла неизвестная ошибка',
			});
		}
	}
}

export default {
	id: 'modal_change_car',
	execute: execute,
};
