const { sendLog } = require('../utils/logging');
const { createAfkModal, createInactiveModal } = require('../ui/modals');
const { safeReply } = require('../utils/safeReply');
const { MessageFlags } = require('discord.js');

async function handleButton(
	i,
	{
		client,
		config,
		afkRepo,
		inactiveRepo,
		updateAfkPanel,
		updateInactivePanel,
	},
) {
	if (!i.isButton()) return false;

	if (i.customId === 'go_afk') {
		await i.showModal(createAfkModal());
		return true;
	}

	if (i.customId === 'go_inactive') {
		await i.showModal(createInactiveModal());
		return true;
	}

	if (i.customId === 'back_afk' || i.customId === 'back_inactive') {
		const isAfk = i.customId === 'back_afk';
		const repo = isAfk ? afkRepo : inactiveRepo;
		const logChannel = isAfk
			? config.channels.afkLog
			: config.channels.inactiveLog;

		const entry = await repo.get(i.user.id);
		if (!entry) {
			await safeReply(i, {
				content: 'Вас нет в списке.',
			});
			return true;
		}

		await sendLog(
			client,
			logChannel,
			`🟢 <@${i.user.id}> вернулся ${
				isAfk ? 'из АФК' : 'из инактива'
			}${isAfk ? `\n Оставлял перса: **${entry.location}**` : ''}`,
		);

		await repo.remove(i.user.id);

		await safeReply(i, {
			content: 'С возвращением!',
		});

		if (isAfk) await updateAfkPanel();
		else await updateInactivePanel();

		return true;
	}

	return false;
}

module.exports = { handleButton };
