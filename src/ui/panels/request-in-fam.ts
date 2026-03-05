
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { updatePanel } from './utils.js';
import { config } from '@/config.js';

export async function buildInactiveEmbed() {

	return new EmbedBuilder()
		.setTitle('Подать заявку')
		.setColor(0x5865f2)
		.setImage(config.bannerUrl)
		.setDescription("Для того, чтобы подать заявку в SAGE FAMILIA, нажмите на кнопку ниже!");
}

export function buildInactiveRow() {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: 'create_request_in_fam',
			label: 'Подать заявку',
			style: ButtonStyle.Success,
		}),

	
	);
}
export async function updateCreateReguestInFamPanel() {
	return updatePanel({
		panelKey: 'request_in_fam_panel',
		buildEmbed: buildInactiveEmbed,
		buildRow: buildInactiveRow,
	});
}
