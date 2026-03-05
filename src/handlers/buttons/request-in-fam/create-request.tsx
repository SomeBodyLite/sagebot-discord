import { requestInFamRepository } from '@/repositories/requestsInFamRepository.js';
import { createInactiveModal } from '@/ui/modals/inactive.js';
import { safeReply } from '@/utils/safeReply.js';
import { ButtonInteraction } from 'discord.js';

async function execute(i: ButtonInteraction) {
	const alredyHaveNewRequest = await requestInFamRepository.get(i.user.id, 'new');
	if (alredyHaveNewRequest) {
		await safeReply(i, {
			content: 'У вас уже есть активная заявка!',
		});
		return true;
	}
	// TODO: сделать проверку на то что человек уже в фаме?

	await i.showModal(createInactiveModal());
}
export default {
	id: 'create_request_in_fam',
	execute: execute,
};