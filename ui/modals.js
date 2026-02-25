const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');

//----------------------------------------------------------------------
// AFK Модальное окно
//----------------------------------------------------------------------
function createAfkModal() {
	const modal = new ModalBuilder({
		customId: 'modal_afk',
		title: 'АФК',
	});

	modal.addComponents(
		new ActionRowBuilder().addComponents(
			new TextInputBuilder({
				customId: 'reason',
				label: 'Причина',
				style: TextInputStyle.Short,
				required: true,
			}),
		),
		new ActionRowBuilder().addComponents(
			new TextInputBuilder({
				customId: 'time',
				label: 'Время возврата ПО МСК (ЧЧ:ММ)',
				style: TextInputStyle.Short,
				required: true,
			}),
		),
		new ActionRowBuilder().addComponents(
			new TextInputBuilder({
				customId: 'location',
				label: 'Где оставил перса?',
				style: TextInputStyle.Short,
				placeholder: 'Например: особа, арена, казик и т.д.',
				required: true,
			}),
		),
	);

	return modal;
}

//----------------------------------------------------------------------
// Inactive Модальное окно
//----------------------------------------------------------------------
function createInactiveModal() {
	const modal = new ModalBuilder({
		customId: 'modal_inactive',
		title: 'Инактив',
	});

	modal.addComponents(
		new ActionRowBuilder().addComponents(
			new TextInputBuilder({
				customId: 'reason',
				label: 'Причина',
				style: TextInputStyle.Short,
				required: true,
			}),
		),
		new ActionRowBuilder().addComponents(
			new TextInputBuilder({
				customId: 'date',
				label: 'Дата возврата (ДД.ММ.ГГГГ)',
				style: TextInputStyle.Short,
				placeholder: '30.11.2026',
				required: true,
			}),
		),
	);

	return modal;
}

module.exports = { createAfkModal, createInactiveModal };
