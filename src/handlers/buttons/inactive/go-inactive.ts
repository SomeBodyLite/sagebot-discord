import { inactiveRepository } from '@/repositories/inactiveRepository.js';
import { createInactiveModal } from '@/ui/modals/inactive.js';
import { safeReply } from '@/utils/safeReply.js';
import { ButtonInteraction } from 'discord.js';

async function execute(i: ButtonInteraction) {
	const alredyInactive = await inactiveRepository.get(i.user.id);
	if (alredyInactive) {
		await safeReply(i, {
			content: 'Вы уже в инавктиве',
		});
		return true;
	}

	await i.showModal(createInactiveModal());
}
export default {
	id: 'go_inactive',
	execute: execute,
};
