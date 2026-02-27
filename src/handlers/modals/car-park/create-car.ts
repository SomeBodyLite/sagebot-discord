import { roles } from '@/data/roles.js';
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

export const getRolesForCar = (role: string) => {
	switch (role) {
		case roles['academy']:
			return ['academy', 'main', 'gold', 'old'];
		case roles['main']:
			return ['main', 'gold', 'old'];
		case roles['gold']:
			return ['gold', 'old'];
		case roles['old']:
			return ['old'];
		default:
			return [];
	}
};
async function execute(i: ModalSubmitInteraction) {
	const logger = new Logger('Create Car Modal Handler');
	const name = i.fields.fields.get('name') as TextInputModalData;
	const numberData = i.fields.fields.get('number') as TextInputModalData;
	const selectedRole = i.fields.fields.get(
		'select_role_for_car',
	) as SelectMenuModalData;

	const number = numberData.value.trim();

	if (!isValidLength(number, { max: 2, min: 2 })) {
		safeReply(i, {
			content: 'Введите только две последние цифры номера!',
		});
		return;
	}

	const roles = getRolesForCar(selectedRole.values[0]);
	try {
		await carParkRepository.create({
			id: '', //id перезаписывается при создании
			name: name.value,
			number: `SAGEXX${number}`,
			roles: roles,
			taked_At: null,
			who_take: null,
		});
		logger.succes(`Car created: Name: ${name.value}, Number:${number}`);
		safeReply(i, {
			content: `\nМашина создана: \n${bold('Название')}: ${name.value}\n${bold('Номер')}: ${number}\n${bold('Роли')}: ${inlineCode(roles.join(', '))}`,
		});
		updateCarParkPanel();
		updateAdminCarParkPanel();
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Ошибка создание автомобиля: ${error.message}`);
			safeReply(i, {
				content: error.message,
			});
		} else {
			logger.error('Неизвестная ошибка создание автомобиля');
			safeReply(i, {
				content: 'Произошла неизвестная ошибка',
			});
		}
	}
}

export default {
	id: 'modal_create_car',
	execute: execute,
};
