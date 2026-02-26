import { ButtonInteraction } from 'discord.js';
import { safeReply } from '@/utils/safeReply.js';
import { carParkRepository } from '@/repositories/carParkRepository.js';
import { updateCarParkPanel } from '@/ui/panels/car-park.js';
import { sendLog } from '@/utils/logging.js';
import { client } from '@/index.js';
import { config } from '@/config.js';

async function execute(i: ButtonInteraction) {
	const allCars = await carParkRepository.getAll();
	const takedCar = allCars.find((car) => car.who_take === i.user.id);
	if (!takedCar) {
		await safeReply(i, {
			content: 'Вы не занимали автомобиль',
		});
		return;
	}

	const updatedCar = {
		...takedCar,
		who_take: null,
		taked_At: null,
	};
	await carParkRepository.update(takedCar.id, updatedCar);

	updateCarParkPanel();

	sendLog(
		client,
		config.channels.carparkLog,
		`<@${i.user.id}> освободил автомобиль
┣ Название: **${updatedCar.name}**
┕  Номер: **${updatedCar.number}**
`,
	);

	await safeReply(i, {
		content: 'Вы освободили автомобиль',
	});
}

export default {
	id: 'release_current',
	execute: execute,
};
