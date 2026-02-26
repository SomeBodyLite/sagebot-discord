import { createAfkModal } from '@/ui/modals/afk.js';
import { ButtonInteraction } from 'discord.js';

async function execute(i: ButtonInteraction) {
	await i.showModal(createAfkModal());
	return;
}
export default {
	id: 'go_afk',
	execute: execute,
};
