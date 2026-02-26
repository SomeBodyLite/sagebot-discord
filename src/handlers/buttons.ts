import { Client, GuildMember, Interaction } from 'discord.js';
import { ConfigType } from '../config.js';
import { AfkRepository } from '../repositories/afkRepository.js';
import { InactiveRepository } from '../repositories/inactiveRepository.js';
import { CarParkRepository } from '../repositories/carParkRepository.js';
import {
	createAfkModal,
	createCarParkModal,
	createInactiveModal,
} from '../ui/modals.js';
import { safeReply } from '../utils/safeReply.js';
import { sendLog } from '../utils/logging.js';

export async function handleButton(
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

				const member = i.member as GuildMember;

				const rolesIds = member.roles.cache.map((role) => role.id);

				const filteredCarList = freeCarsList.filter((car) =>
					car.roles.some((roleId) => rolesIds.includes(roleId)),
				);

				await i.showModal(createCarParkModal(filteredCarList));
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

				sendLog(
					client,
					config.channels.carparkLog,
					`<@${i.user.id}> освободил автомобиль
┣ Название: **${updatedCar.name}**
┕  Номер: **${updatedCar.number}**
`,
				);

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
