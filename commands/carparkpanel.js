const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadAsync, saveAsync } = require('../utils/storage');
const { safeReply } = require('../utils/safeReply');

const data = new SlashCommandBuilder()
	.setName('carpanel')
	.setDescription('Создать панель автопарка');

async function execute(i, { config, updateCarParkPanel }) {
	if (i.channelId !== config.channels.carpark) {
		await safeReply(i, {
			content:
				'❌ Эту команду можно использовать только в канале автопарка.',
		});
		return true;
	}

	const msg = await i.channel.send({
		embeds: [
			new EmbedBuilder({
				title: 'Загрузка панели...',
				color: 0x5865f2,
			}),
		],
	});

	const panels = await loadAsync(config.files.panels);
	panels.carpark = {
		channelId: i.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateCarParkPanel();

	await safeReply(i, {
		content: '✅ Панель создана!',
	});

	return true;
}

module.exports = {
	data,
	execute,
};
