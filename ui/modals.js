const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	LabelBuilder,
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

//----------------------------------------------------------------------
// CarPark Модальное окно
//----------------------------------------------------------------------
function createCarParkModal(freeCarsList) {
	const modal = new ModalBuilder({
		customId: 'modal_carpark',
		title: 'Автопарк',
	});

	const options = freeCarsList.map((car) =>
		new StringSelectMenuOptionBuilder()
			.setLabel(car.name)
			.setDescription(car.number)
			.setValue(car.id),
	);

	const select = new StringSelectMenuBuilder()
		.setCustomId('select_list_cars')
		.setPlaceholder('Выберите из списка')
		.addOptions(options);

	const selectLabel = new LabelBuilder()
		.setLabel('Выберите автомобиль')
		.setDescription(
			'Вы займете его на 2 часа, после чего бронирование нужно будет повторить!',
		)
		.setStringSelectMenuComponent(select);

	modal.addLabelComponents(selectLabel);
	return modal;
}

module.exports = { createAfkModal, createInactiveModal, createCarParkModal };
