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

async function buildCarParkEmbed() {
	const data: Car[] = await carParkRepository.getAll();

	const description = data
		.map((carData) => {
			if (carData.who_take) {
				const diffMs =
					3 * 60 * 60 * 1000 - (Date.now() - carData.taked_At!);
				const diffMinutes = Math.floor(diffMs / 1000 / 60);
				const hours = Math.floor(diffMinutes / 60);
				const minutes = diffMinutes % 60;
				const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

				return `🔴 ${carData.number} **| ${carData.name}**
         > Занял: <@${carData.who_take}> 
				 > Осталось: ${time}`;
			} else {
				return `🟢 ${inlineCode(carData.number)} **| ${carData.name}**`;
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
