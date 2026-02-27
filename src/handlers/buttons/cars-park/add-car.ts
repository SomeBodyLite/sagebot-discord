import { ButtonInteraction } from 'discord.js';

import { createCarModal } from '@/ui/modals/car-park/add-car.js';

async function execute(i: ButtonInteraction) {
	await i.showModal(createCarModal());
}

export default {
	id: 'admin_add_car',
	execute: execute,
};
