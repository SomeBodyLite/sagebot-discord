import { Client, Interaction, SelectMenuModalData } from 'discord.js';
import { ConfigType } from '../config';
import { AfkRepository } from '../repositories/afkRepository';
import { InactiveRepository } from '../repositories/inactiveRepository';
import { CarParkRepository } from '../repositories/carParkRepository';
import {
	convertMskTimeToNextTimestamp,
	formatMskDateTime,
	formatMskTime,
	isTomorrow,
	isValidDate,
	isValidTime,
} from '../utils/time';
import { safeReply } from '../utils/safeReply';
import { sendLog } from '../utils/logging';

function isValidLength(
	value: string,
	{ min, max }: { min: number; max: number },
) {
	const len = value.trim().length;
	return len >= min && len <= max;
}

async function handleModal(
	i: Interaction,
	{
		client,
		config,
		afkRepo,
		inactiveRepo,
		carParkRepo,
		updateAfkPanel,
		updateInactivePanel,
		updateCarParkPanel,
	}: {
		client: Client;
		config: ConfigType;
		afkRepo: AfkRepository;
		inactiveRepo: InactiveRepository;
		carParkRepo: CarParkRepository;
		updateAfkPanel: () => Promise<void>;
		updateInactivePanel: () => Promise<void>;
		updateCarParkPanel: () => Promise<void>;
	},
) {
	if (!i.isModalSubmit()) return false;

	// Обработка и валидация AFK модалки
	if (i.customId === 'modal_afk') {
		const time = i.fields.getTextInputValue('time').trim();
		if (!isValidTime(time)) {
			await safeReply(i, {
				content: 'Формат времени: ЧЧ:ММ (например 09:30)',
			});
			return true;
		}

		const reason = i.fields.getTextInputValue('reason').trim();
		const location = i.fields.getTextInputValue('location').trim();

		if (!isValidLength(reason, { min: 1, max: 100 })) {
			await safeReply(i, {
				content: 'Причина: 1–100 символов.',
			});
			return true;
		}
		if (!isValidLength(location, { min: 1, max: 100 })) {
			await safeReply(i, {
				content: 'Локация: 1–100 символов.',
			});
			return true;
		}

		const untilTimestamp = convertMskTimeToNextTimestamp(time);
		const alreadyAfk = await afkRepo.has(i.user.id);
		const oldData = await afkRepo.get(i.user.id);

		await afkRepo.set(i.user.id, {
			reason,
			location,
			time,
			until: untilTimestamp,
		});

		const returnDate = new Date(untilTimestamp);
		const returnText = isTomorrow(untilTimestamp)
			? formatMskDateTime(returnDate)
			: formatMskTime(returnDate);

		if (alreadyAfk) {
			const oldReturnDate = new Date(oldData?.until);
			const oldReturnText = isTomorrow(oldData?.until)
				? formatMskDateTime(oldReturnDate)
				: formatMskTime(oldReturnDate);

			await sendLog(
				client,
				config.channels.afkLog,
				`🔄 <@${i.user.id}> ОБНОВИЛ СРОК АФК
┣ Было до: **${oldReturnText}**
┣ Стало до: **${returnText}**
┣ Локация: **${oldData?.location} → ${location}**
┕ Причина: **${reason}**`,
			);
		} else {
			await sendLog(
				client,
				config.channels.afkLog,
				`🟡 <@${i.user.id}> ушёл в АФК
┣ Причина: **${reason}**
┣ Где оставил перса: **${location}**
┕ Вернётся: **${returnText}**`,
			);
		}

		await safeReply(i, {
			content: 'Статус обновлен.',
		});
		updateAfkPanel();
		return true;
	}

	// Обработка и валидация CarPark модалки
	if (i.customId === 'modal_carpark') {
		const selectField = i.fields.fields.get(
			'select_list_cars',
		) as SelectMenuModalData;

		if (!selectField) return;
		const carId = selectField.values[0];
		let car = await carParkRepo.get(carId);
		if (!car) return;
		const now = Date.now();
		car = {
			...car,
			who_take: i.user.id,
			taked_At: now,
		};
		await carParkRepo.update(carId, car);

		await safeReply(i, {
			content: `Вы выбрали автомобиль: ${car.name} | ${car.number}`,
		});
		await updateCarParkPanel();
		return true;
	}

	// Обработка и валидация Inactive модалки
	if (i.customId === 'modal_inactive') {
		const date = i.fields.getTextInputValue('date').trim();
		if (!isValidDate(date)) {
			await safeReply(i, {
				content:
					'Используйте формат даты: ДД.ММ.ГГГГ (например 30.11.2026)',
			});
			return true;
		}

		const reason = i.fields.getTextInputValue('reason').trim();
		if (!isValidLength(reason, { min: 1, max: 100 })) {
			await safeReply(i, {
				content: 'Причина: 1–100 символов.',
			});
			return true;
		}
		await inactiveRepo.set(i.user.id, { reason, date });

		await sendLog(
			client,
			config.channels.inactiveLog,
			`🔴 <@${i.user.id}> ушёл в инактив\n┣ Причина: **${reason}**\n┕ Возврат: **${date}**`,
		);

		await safeReply(i, {
			content: 'Инактив зафиксирован.',
		});
		await updateInactivePanel();
		return true;
	}

	return false;
}

module.exports = { handleModal };
