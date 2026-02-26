import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { ConfigType } from '../../config.js';
import { safeReply } from '../../utils/safeReply.js';
import { loadAsync, saveAsync } from '../../utils/storage.js';
import { Command } from '../../types/Command.js';

const data = new SlashCommandBuilder()
	.setName('afkpanel')
	.setDescription('Создать панель АФК');

type ExecuteOptions = {
	config: ConfigType;
	updateAfkPanel: () => Promise<void>;
};

async function execute(
	interaction: ChatInputCommandInteraction,
	{ config, updateAfkPanel }: ExecuteOptions,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;
	if (interaction.channelId !== config.channels.afkPanel) {
		await safeReply(interaction, {
			content: '❌ Эту команду можно использовать только в канале АФК.',
		});
		return;
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

	return;
}

const command: Command = {
	data,
	execute,
};
export default command;
