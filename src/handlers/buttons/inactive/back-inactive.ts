import { ButtonInteraction } from 'discord.js';
import { updateInactivePanel } from '@/ui/panels/inactive.js';
import { inactiveRepository } from '@/repositories/inactiveRepository.js';
import { safeReply } from '@/utils/safeReply.js';
import { sendLog } from '@/utils/logging.js';
import { client } from '@/index.js';
import { config } from '@/config.js';
import { getUserUsernames } from '@/utils/tools.js';

async function execute(i: ButtonInteraction) {
	const entry = await inactiveRepository.get(i.user.id);
	if (!entry) {
		await safeReply(i, {
			content: 'Вас нет в списке.',
		});
		return;
	}

	const usernameString = await getUserUsernames(i.user);

	await sendLog(
		client,
		config.channels.inactiveLog,
		`${usernameString}`,
		'🟢 Участник вернулся из инактива',
	);

	await inactiveRepository.remove(i.user.id);

	await safeReply(i, {
		content: 'С возвращением!',
	});

	updateInactivePanel();
}
export default {
	id: 'back_inactive',
	execute: execute,
};
