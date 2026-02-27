import { carParkRepository } from '@/repositories/carParkRepository.js';
import { Car } from '@/types/index.js';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { updatePanel } from './utils.js';

async function buildCarParkEmbed() {
	const data: Car[] = await carParkRepository.getAll();

	const description = data
		.map((carData) => {
			if (carData.who_take) {
				return `🔴 ${carData.number} | ${carData.name} **Занял**: <@${carData.who_take}>`;
			} else {
				return `🟢 ${carData.number} | ${carData.name}`;
			}
		})
		.join('\n');

	return new EmbedBuilder()
		.setTitle('Управление автопарком')
		.setColor(0x5865f2)
		.setDescription(description);
}

function buildCarParkRow() {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: 'admin_add_car',
			label: 'Создать',
			style: ButtonStyle.Success,
		}),
		new ButtonBuilder({
			customId: 'admin_delete_car',
			label: 'Удалить',
			style: ButtonStyle.Danger,
		}),
		new ButtonBuilder({
			customId: 'admin_change_car',
			label: 'Изменить',
			style: ButtonStyle.Secondary,
		}),
	);
}
export async function updateAdminCarParkPanel() {
	return updatePanel({
		panelKey: 'carparkAdmin',
		buildEmbed: buildCarParkEmbed,
		buildRow: buildCarParkRow,
	});
}
