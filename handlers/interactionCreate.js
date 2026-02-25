const { handleButton } = require('./buttons');
const { handleModal } = require('./modals');
const { safeReply } = require('../utils/safeReply');
const { commandMap } = require('../commands');

function createInteractionHandler(deps) {
	return async (i) => {
		try {
			if (i.isChatInputCommand()) {
				const command = commandMap.get(i.commandName);
				if (!command || typeof command.execute !== 'function') {
					return false;
				}
				await command.execute(i, deps);
				return true;
			}
			if (i.isButton()) return await handleButton(i, deps);
			if (i.isModalSubmit()) return await handleModal(i, deps);
			return false;
		} catch (e) {
			console.log('interaction handler error:', e);
			await safeReply(i, {
				content: 'Произошла ошибка. Попробуйте ещё раз позже.',
			});
			return true;
		}
	};
}

module.exports = { createInteractionHandler };
