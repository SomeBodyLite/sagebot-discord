const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadAsync, saveAsync } = require('../utils/storage');
const { safeReply } = require('../utils/safeReply');

const data = new SlashCommandBuilder()
	.setName('inactivepanel')
	.setDescription('Создать панель инактива');

async function execute(i, { config, updateInactivePanel }) {
	if (i.channelId !== config.channels.inactivePanel) {
		await safeReply(i, {
			content:
				'❌ Эту команду можно использовать только в канале инактива.',
		});
		return true;
	}

	const msg = await i.channel.send({
		embeds: [
			new EmbedBuilder({
				title: '📅 Загрузка инактива...',
				color: 0x5865f2,
			}),
		],
		// components: [],
	});

	const panels = await loadAsync(config.files.panels);
	panels.inactive = {
		channelId: i.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateInactivePanel();

	await safeReply(i, {
		content: '✅ Панель создана!',
	});

	return true;
}

module.exports = {
	data,
	execute,
};
