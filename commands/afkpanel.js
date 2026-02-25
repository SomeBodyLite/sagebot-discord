const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadAsync, saveAsync } = require('../utils/storage');
const { safeReply } = require('../utils/safeReply');

const data = new SlashCommandBuilder()
	.setName('afkpanel')
	.setDescription('Создать панель АФК');

async function execute(i, { config, updateAfkPanel }) {
	if (i.channelId !== config.channels.afkPanel) {
		await safeReply(i, {
			content: '❌ Эту команду можно использовать только в канале АФК.',
		});
		return true;
	}

	const msg = await i.channel.send({
		embeds: [
			new EmbedBuilder({
				title: '🕒 Загрузка АФК...',
				color: 0xaa0000,
			}),
		],
		// components: [],
	});

	const panels = await loadAsync(config.files.panels);
	panels.afk = {
		channelId: i.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateAfkPanel();

	await safeReply(i, {
		content: '✅ Панель создана!',
	});

	return true;
}

module.exports = {
	data,
	execute,
};
