import { loadButtons } from '@/handlers/buttons/index.js';
import { loadCommands } from '@/handlers/commands/index.js';
import { loadModals } from '@/handlers/modals/index.js';
import Logger from '@/utils/logger.js';

export default async function loadModules() {
	const logger = new Logger('Modules Loader');
	logger.info('Start load commands');
	await loadCommands();
	logger.info('Start load buttons');
	await loadButtons();
	logger.info('Start load modals');
	await loadModals();
}
