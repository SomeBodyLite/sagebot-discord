import { carParkRepository } from '@/repositories/carParkRepository.js';
import { Car } from '@/types/index.js';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	inlineCode,
} from 'discord.js';
import { updatePanel } from './utils.js';
import { client } from '@/index.js';
import { getUserUsernames } from '@/utils/tools.js';

export async function buildCarParkEmbed() {
	const data: Car[] = await carParkRepository.getAll();
	const description = (
		await Promise.all(
			data.map(async (carData) => {
				if (carData.who_take) {
					const diffMs =
						3 * 60 * 60 * 1000 - (Date.now() - carData.taked_At!);
					const diffMinutes = Math.floor(diffMs / 1000 / 60);
					const hours = Math.floor(diffMinutes / 60);
					const minutes = diffMinutes % 60;
					const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

					const user = await client.users.fetch(carData.who_take);
					const usernameString = await getUserUsernames(user);

					return `🔴 ** ${carData.name}** | ${carData.number}
         > Занял: ${usernameString}
				 > Осталось: ${time}`;
				} else {
					return `🟢 ** ${carData.name}** | ${carData.number}`;
				}
			}),
		)
	).join('\n');

	return new EmbedBuilder()
		.setTitle('🚗 Автопарк')
		.setColor(0x5865f2)
		.setDescription(description);
}

export function buildCarParkRow() {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: 'list_cars',
			label: 'Список Авто',
			style: ButtonStyle.Success,
		}),

		new ButtonBuilder({
			customId: 'release_current',
			label: 'Освободить текущий',
			style: ButtonStyle.Danger,
		}),
	);
}
export async function updateCarParkPanel() {
	return updatePanel({
		panelKey: 'carpark',
		buildEmbed: buildCarParkEmbed,
		buildRow: buildCarParkRow,
	});
}
