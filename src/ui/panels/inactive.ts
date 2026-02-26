import { inactiveRepository } from '@/repositories/inactiveRepository.js';
import { InactiveUserInfo } from '@/types/index.js';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { updatePanel } from './utils.js';
import { config } from '@/config.js';

export async function buildInactiveEmbed() {
	const data = await inactiveRepository.getAll();
	const users: [string, InactiveUserInfo][] = Object.entries(data);

	const description =
		users.length === 0
			? 'В инактиве никого нет.'
			: `В инактиве **${users.length}** человек:\n\n` +
				users
					.map(
						([id, info], idx) =>
							`${idx + 1}) <@${id}> - Причина: "${info.reason}" - Вернусь: **${info.date}**`,
					)
					.join('\n');

	return new EmbedBuilder()
		.setTitle('📅 Список инактива')
		.setColor(0x5865f2)
		.setImage(config.BANNER_URL)
		.setDescription(description);
}

export function buildInactiveRow() {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: 'go_inactive',
			label: 'Уйти в инактив',
			style: ButtonStyle.Success,
		}),

		new ButtonBuilder({
			customId: 'back_inactive',
			label: 'Выйти из инактива',
			style: ButtonStyle.Secondary,
		}),
	);
}
export async function updateInactivePanel() {
	return updatePanel({
		panelKey: 'inactive',
		buildEmbed: buildInactiveEmbed,
		buildRow: buildInactiveRow,
	});
}
