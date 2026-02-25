import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';
import { ConfigType } from '../config';
import { loadAsync, saveAsync } from '../utils/storage';
import { safeReply } from '../utils/safeReply';

export const data = new SlashCommandBuilder()
	.setName('inactivepanel')
	.setDescription('Создать панель инактива');

type ExecuteOptions = {
	config: ConfigType;
	updateInactivePanel: () => Promise<void>;
};

export async function execute(
	interaction: ChatInputCommandInteraction,
	{ config, updateInactivePanel }: ExecuteOptions,
): Promise<boolean> {
	if (!interaction.channel?.isSendable()) return false;

	if (interaction.channelId !== config.channels.inactivePanel) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале инактива.',
			ephemeral: true,
		});
		return true;
	}

	const message = await interaction.channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('📅 Загрузка инактива...')
				.setColor(0x5865f2),
		],
	});

	const panels = await loadAsync(config.files.panels);

	panels.inactive = {
		channelId: interaction.channel.id,
		messageId: message.id,
	};

	await saveAsync(config.files.panels, panels);
	await updateInactivePanel();

	await safeReply(interaction, {
		content: '✅ Панель создана!',
		ephemeral: true,
	});

	return true;
}
