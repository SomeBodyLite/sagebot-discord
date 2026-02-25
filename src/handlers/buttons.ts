import { Client, Interaction } from 'discord.js';
import { ConfigType } from '../config';
import { AfkRepository } from '../repositories/afkRepository';
import { InactiveRepository } from '../repositories/inactiveRepository';
import { CarParkRepository } from '../repositories/carParkRepository';
import {
	createAfkModal,
	createCarParkModal,
	createInactiveModal,
} from '../ui/modals';
import { safeReply } from '../utils/safeReply';
import { sendLog } from '../utils/logging';

async function handleButton(
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
	if (!i.isButton()) return false;

	if (i.customId === 'go_afk') {
		await i.showModal(createAfkModal());
		return true;
	}

	if (i.customId === 'go_inactive') {
		await i.showModal(createInactiveModal());
		return true;
	}

	if (i.customId === 'back_afk' || i.customId === 'back_inactive') {
		const isAfk = i.customId === 'back_afk';
		const repo = isAfk ? afkRepo : inactiveRepo;
		const logChannel = isAfk
			? config.channels.afkLog
			: config.channels.inactiveLog;

		const entry = await repo.get(i.user.id);
		if (!entry) {
			await safeReply(i, {
				content: 'Вас нет в списке.',
			});
			return true;
		}

		await sendLog(
			client,
			logChannel,
			`🟢 <@${i.user.id}> вернулся ${
				isAfk ? 'из АФК' : 'из инактива'
			}${isAfk ? `\n Оставлял перса: **${entry.location}**` : ''}`,
		);

		await repo.remove(i.user.id);

		await safeReply(i, {
			content: 'С возвращением!',
		});

		if (isAfk) await updateAfkPanel();
		else await updateInactivePanel();

		return true;
	}

	const carsParkBtnsIds = ['list_cars', 'release_current'];
	if (carsParkBtnsIds.includes(i.customId)) {
		const allCars = await carParkRepo.getAll();
		const freeCarsList = await carParkRepo.getAllFree();
		const takedCar = allCars.find((car) => car.who_take === i.user.id);

		switch (i.customId) {
			case 'list_cars':
				if (takedCar) {
					return await safeReply(i, {
						content: 'Вы уже заняли автомобиль',
					});
				}
				await i.showModal(createCarParkModal(freeCarsList));
				return true;

			case 'release_current':
				if (!takedCar) {
					return await safeReply(i, {
						content: 'Вы не занимали автомобиль',
					});
				}

				const updatedCar = {
					...takedCar,
					who_take: null,
					taked_At: null,
				};
				await carParkRepo.update(takedCar.id, updatedCar);

				updateCarParkPanel();

				return await safeReply(i, {
					content: 'Вы освободили автомобиль',
				});

			default:
				console.log('error');
				await updateCarParkPanel();
				return false;
		}
	}

	return false;
}

module.exports = { handleButton };
