import { config } from '@/config.js';
import { client } from '@/index.js';
import { carParkRepository } from '@/repositories/carParkRepository.js';
import { updateCarParkPanel } from '@/ui/panels/car-park.js';
import { sendLog } from '@/utils/logging.js';
import { safeReply } from '@/utils/safeReply.js';
import { ModalSubmitInteraction, SelectMenuModalData } from 'discord.js';

async function execute(i: ModalSubmitInteraction) {
	const selectField = i.fields.fields.get(
		'select_list_cars',
	) as SelectMenuModalData;

	if (!selectField) return;
	const carId = selectField.values[0];
	let car = await carParkRepository.get(carId);
	if (!car) return;

	if (car.taked_At || car.who_take) {
		await safeReply(i, {
			content: `Автомобиль уже занят, возьмите другой`,
		});
		return;
	}

	const now = Date.now();
	car = {
		...car,
		who_take: i.user.id,
		taked_At: now,
	};
	await carParkRepository.update(carId, car);

	await safeReply(i, {
		content: `Вы выбрали автомобиль: ** ${car.name} | ${car.number}**`,
	});

	sendLog(
		client,
		config.channels.carparkLog,
		`<@${i.user.id}> взял автомобиль
┣ Название: **${car.name}**
┣ Номер: **${car.number}**
┕ Время: **${new Date(car.taked_At!).toLocaleTimeString('ru-RU', {
			timeZone: 'Europe/Moscow',
			hour: '2-digit',
			minute: '2-digit',
		})}**`,
	);

	updateCarParkPanel();
	return;
}
export default {
	id: 'modal_carpark',
	execute: execute,
};
