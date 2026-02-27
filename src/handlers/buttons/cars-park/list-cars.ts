import { ButtonInteraction, GuildMember } from 'discord.js';
import { safeReply } from '@/utils/safeReply.js';
import { carParkRepository } from '@/repositories/carParkRepository.js';
import { createCarParkModal } from '@/ui/modals/car-park.js';
import { roles } from '@/data/roles.js';

async function execute(i: ButtonInteraction) {
	const allCars = await carParkRepository.getAll();
	const freeCarsList = await carParkRepository.getAllFree();
	const takedCar = allCars.find((car) => car.who_take === i.user.id);

	if (takedCar) {
		await safeReply(i, {
			content: 'Вы уже заняли автомобиль',
		});
		return;
	}

	const member = i.member as GuildMember;

	const rolesSet = new Set(member.roles.cache.map((r) => r.id));
	const filteredCarList = freeCarsList.filter((car) =>
		car.roles.some((roleName) => rolesSet.has(roles[roleName])),
	);
	await i.showModal(createCarParkModal(filteredCarList));
}

export default {
	id: 'list_cars',
	execute: execute,
};
