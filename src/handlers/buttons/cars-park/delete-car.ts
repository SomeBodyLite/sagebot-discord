import { ButtonInteraction } from 'discord.js';

import { deleteCarModal } from '@/ui/modals/car-park/delete-cat.js';

async function execute(i: ButtonInteraction) {
	await i.showModal(await deleteCarModal());
}

export default {
	id: 'admin_delete_car',
	execute: execute,
};
