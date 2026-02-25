//----------------------------------------------------------------------
// AFK Модальное окно

import {
	ActionRowBuilder,
	LabelBuilder,
	ModalBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { Car } from '../types';

//----------------------------------------------------------------------
export function createAfkModal() {
	// Каждый инпут в отдельной строке
	const locationRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder()
			.setCustomId('location')
			.setLabel('Где оставил перса?')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Например: особа, арена, казик и т.д.')
			.setRequired(true),
	);

	const timeRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder()
			.setCustomId('time')
			.setLabel('Время возврата ПО МСК (ЧЧ:ММ)')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder()
			.setCustomId('reason')
			.setLabel('Причина')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const modal = new ModalBuilder()
		.setCustomId('modal_afk')
		.setTitle('АФК')
		.setComponents([locationRow, timeRow, reasonRow]);

	return modal;
}

//----------------------------------------------------------------------
// Inactive Модальное окно
//----------------------------------------------------------------------
export function createInactiveModal() {
	const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder()
			.setCustomId('reason')
			.setLabel('Причина')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const dateRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder()
			.setCustomId('date')
			.setLabel('Дата возврата (ДД.ММ.ГГГГ)')
			.setPlaceholder('30.11.2026')
			.setStyle(TextInputStyle.Short)
			.setRequired(true),
	);

	const modal = new ModalBuilder()
		.setCustomId('modal_inactive')
		.setTitle('Инактив')
		.setComponents([reasonRow, dateRow]);

	return modal;
}

//----------------------------------------------------------------------
// CarPark Модальное окно
//----------------------------------------------------------------------
export function createCarParkModal(freeCarsList: Car[]) {
	const options = freeCarsList.map((car: Car) =>
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
	const modal = new ModalBuilder({
		customId: 'modal_carpark',
		title: 'Автопарк',
	});
	modal.addLabelComponents(selectLabel);
	return modal;
}
