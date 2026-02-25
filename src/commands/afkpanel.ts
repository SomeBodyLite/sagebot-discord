import { ChatInputCommandInteraction } from 'discord.js';
import { ConfigType } from '../config';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadAsync, saveAsync } = require('../utils/storage');
const { safeReply } = require('../utils/safeReply');

export const data = new SlashCommandBuilder()
	.setName('afkpanel')
	.setDescription('Создать панель АФК');

type ExecuteOptions = {
	config: ConfigType;
	updateAfkPanel: () => Promise<void>;
};

export async function execute(
	interaction: ChatInputCommandInteraction,
	{ config, updateAfkPanel }: ExecuteOptions,
): Promise<boolean> {
	if (!interaction.channel?.isSendable()) return false;
	if (interaction.channelId !== config.channels.afkPanel) {
		await safeReply(interaction, {
			content: '❌ Эту команду можно использовать только в канале АФК.',
		});
		return true;
	}

	const msg = await interaction.channel.send({
		embeds: [
			new EmbedBuilder({
				title: '🕒 Загрузка АФК...',
				color: 0xaa0000,
			}),
		],
	});

	const panels = await loadAsync(config.files.panels);
	panels.afk = {
		channelId: interaction.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateAfkPanel();

	await safeReply(interaction, {
		content: '✅ Панель создана!',
	});

	return true;
}

module.exports = {
	data,
	execute,
};
