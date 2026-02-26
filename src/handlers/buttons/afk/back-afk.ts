import { ButtonInteraction } from 'discord.js';
import { afkRepository } from '@/repositories/index.js';
import { updateAfkPanel } from '@/ui/panels/afk.js';
import { sendLog } from '@/utils/logging.js';
import { safeReply } from '@/utils/safeReply.js';
import { client } from '@/index.js';
import { config } from '@/config.js';

async function execute(i: ButtonInteraction) {
	const entry = await afkRepository.get(i.user.id);
	if (!entry) {
		await safeReply(i, {
			content: 'Вас нет в списке.',
		});
		return;
	}
	await sendLog(
		client,
		config.channels.afkLog,
		`🟢 <@${i.user.id}> вернулся из АФК\n Оставлял перса: **${entry.location}**`,
	);

	await afkRepository.remove(i.user.id);

	await safeReply(i, {
		content: 'С возвращением!',
	});

	updateAfkPanel();
}

export default {
	id: 'back_afk',
	execute: execute,
};
