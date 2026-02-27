import { afkRepository } from '@/repositories/afkRepository.js';
import { createAfkModal } from '@/ui/modals/afk.js';
import { safeReply } from '@/utils/safeReply.js';
import { ButtonInteraction } from 'discord.js';

async function execute(i: ButtonInteraction) {
	const alredyAfk = await afkRepository.get(i.user.id);
	if (alredyAfk) {
		await safeReply(i, {
			content: 'Вы уже AFK',
		});
		return true;
	}
	await i.showModal(createAfkModal());
}
export default {
	id: 'go_afk',
	execute: execute,
};
