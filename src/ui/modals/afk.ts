import {
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
} from 'discord.js';

export function createAfkModal() {
	const locationRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Где оставил перса?',
		})
			.setCustomId('location')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Например: особа, арена, казик и т.д.')
			.setRequired(true),
	);

	const timeRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Время возврата ПО МСК (ЧЧ:ММ)',
		})
			.setCustomId('time')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Причина',
		})
			.setCustomId('reason')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const modal = new ModalBuilder({
		components: [locationRow, timeRow, reasonRow],
	})
		.setCustomId('modal_afk')
		.setTitle('АФК');

	return modal;
}
