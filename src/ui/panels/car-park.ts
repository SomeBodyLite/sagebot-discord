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

export async function buildCarParkEmbed() {
	const data: Car[] = await carParkRepository.getAll();
	const description = data
		.map((carData) => {
			if (carData.who_take) {
				// return `🔴 ${carData.number} **| ${carData.name} |** **Занял**: <@${carData.who_take}>`;
				return `🔴 ${inlineCode(carData.number)} **| ${carData.name} |** Занял: <@${carData.who_take}>`;
				
			} else {
				return `🟢 ${inlineCode(carData.number)} **| ${carData.name}**`;
			}
		})
		.join('\n');

	return new EmbedBuilder()
		.setTitle('Автопарк')
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
