import { ModalSubmitInteraction } from 'discord.js';
import { config } from '@/config.js';
import { client } from '@/index.js';
import { afkRepository } from '@/repositories/afkRepository.js';
import { updateAfkPanel } from '@/ui/panels/afk.js';
import { sendLog } from '@/utils/logging.js';
import { safeReply } from '@/utils/safeReply.js';
import {
	isValidTime,
	convertMskTimeToNextTimestamp,
	isTomorrow,
	formatMskDateTime,
	formatMskTime,
} from '@/utils/time.js';
import { isValidLength } from '@/utils/validators.js';
import { getUserUsernames } from '@/utils/tools.js';

async function execute(i: ModalSubmitInteraction) {
	const time = i.fields.getTextInputValue('time').trim();
	if (!isValidTime(time)) {
		await safeReply(i, {
			content: 'Формат времени: ЧЧ:ММ (например 09:30)',
		});
		return;
	}

	const reason = i.fields.getTextInputValue('reason').trim();
	const location = i.fields.getTextInputValue('location').trim();

	if (!isValidLength(reason, { min: 1, max: 100 })) {
		await safeReply(i, {
			content: 'Причина: 1–100 символов.',
		});
		return;
	}
	if (!isValidLength(location, { min: 1, max: 100 })) {
		await safeReply(i, {
			content: 'Локация: 1–100 символов.',
		});
		return;
	}

	const untilTimestamp = convertMskTimeToNextTimestamp(time);
	const alreadyAfk = await afkRepository.has(i.user.id);
	const oldData = await afkRepository.get(i.user.id);

	await afkRepository.set(i.user.id, {
		reason,
		location,
		time,
		until: untilTimestamp,
	});

	const returnDate = new Date(untilTimestamp);
	const returnText = isTomorrow(untilTimestamp)
		? formatMskDateTime(returnDate)
		: formatMskTime(returnDate);

	const usernameString = await getUserUsernames(i.user);

	if (alreadyAfk) {
		const oldReturnDate = new Date(oldData?.until);
		const oldReturnText = isTomorrow(oldData?.until)
			? formatMskDateTime(oldReturnDate)
			: formatMskTime(oldReturnDate);

		await sendLog(
			client,
			config.channels.afkLog,
			`${usernameString}
┣ Было до: **${oldReturnText}**
┣ Стало до: **${returnText}**
┣ Локация: **${oldData?.location} → ${location}**
┕ Причина: **${reason}**`,
			'🔄 АФК статус обновлен',
		);
	} else {
		await sendLog(
			client,
			config.channels.afkLog,
			`${usernameString}
┣ Причина: **${reason}**
┣ Где оставил перса: **${location}**
┕ Вернётся: **${returnText}**`,
			'🟡 Участник ушел в АФК',
		);
	}

	await safeReply(i, {
		content: 'Статус обновлен.',
	});
	updateAfkPanel();
	return;
}

export default {
	id: 'modal_afk',
	execute: execute,
};
