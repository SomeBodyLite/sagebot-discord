import { loadButtons } from '@/handlers/buttons/index.js';
import { loadCommands } from '@/handlers/commands/index.js';
import { loadModals } from '@/handlers/modals/index.js';
import { loadSelects } from '@/handlers/select/index.js';

export default async function loadModules() {
	await loadCommands();
	await loadButtons();
	await loadModals();
	await loadSelects();
}
