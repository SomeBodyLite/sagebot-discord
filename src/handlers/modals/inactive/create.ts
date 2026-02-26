import { ModalSubmitInteraction } from 'discord.js';
import { config } from '@/config.js';
import { client } from '@/index.js';
import { sendLog } from '@/utils/logging.js';
import { safeReply } from '@/utils/safeReply.js';
import { isValidDate } from '@/utils/time.js';
import { inactiveRepository } from '@/repositories/inactiveRepository.js';
import { updateInactivePanel } from '@/ui/panels/inactive.js';
import { isValidLength } from '@/utils/validators.js';

async function execute(i: ModalSubmitInteraction) {
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
	await inactiveRepository.set(i.user.id, { reason, date });

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

export default {
	id: 'modal_inactive',
	execute: execute,
};
