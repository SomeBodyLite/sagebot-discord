import { createInactiveModal } from '@/ui/modals/inactive.js';
import { ButtonInteraction } from 'discord.js';

async function execute(i: ButtonInteraction) {
	await i.showModal(createInactiveModal());
	return;
}
export default {
	id: 'go_inactive',
	execute: execute,
};
