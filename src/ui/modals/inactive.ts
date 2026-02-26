import {
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
} from 'discord.js';

export function createInactiveModal() {
	const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Причина',
		})
			.setCustomId('reason')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);
	const dateRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Дата возврата (ДД.ММ.ГГГГ)',
		})
			.setCustomId('date')
			.setPlaceholder('30.11.2026')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const modal = new ModalBuilder({
		components: [reasonRow, dateRow],
	})
		.setCustomId('modal_inactive')
		.setTitle('Инактив');

	return modal;
}
