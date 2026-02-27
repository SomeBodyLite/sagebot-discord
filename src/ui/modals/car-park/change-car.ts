import { roles } from '@/data/roles.js';
import { Car } from '@/types/index.js';
import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuOptionBuilder,
	StringSelectMenuBuilder,
	LabelBuilder,
} from 'discord.js';

export function changeCarModal(car: Car) {
	const cropedNumber = car.number.slice(-2);
	const numberInput = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Номер авто (последние две цифры)',
		})
			.setCustomId('number')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Например: 01, 12 и т.д.')
			.setValue(cropedNumber)
			.setRequired(true),
	);
	const nameInput = new ActionRowBuilder<TextInputBuilder>().addComponents(
		new TextInputBuilder({
			label: 'Название авто',
		})
			.setCustomId('name')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Например: Lampadati Julia')
			.setValue(car.name)
			.setRequired(true),
	);

	const rolesNames = Object.keys(roles);
	const options = rolesNames.map((name: string) =>
		new StringSelectMenuOptionBuilder()
			.setLabel(name)
			.setValue(roles[name])
			.setDefault(car.roles[0] === name),
	);

	const selectRole = new LabelBuilder()
		.setLabel('Выберите Роль')
		.setDescription(
			'При вы выборе роли, доступ получает она и все что выше по иерархии',
		)
		.setStringSelectMenuComponent(
			new StringSelectMenuBuilder()
				.setCustomId('select_role_for_car')
				.setPlaceholder('Выберите из списка')
				.addOptions(options),
		);

	const modal = new ModalBuilder({
		components: [nameInput, numberInput, selectRole],
		customId: `modal_change_car:id_${car.id}`,
		title: 'Изменить Автомобиль',
	});
	return modal;
}
