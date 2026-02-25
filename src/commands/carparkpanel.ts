import { ConfigType } from '../config';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { safeReply } from '../utils/safeReply';
import { loadAsync, saveAsync } from '../utils/storage';

export const data = new SlashCommandBuilder()
	.setName('carpanel')
	.setDescription('Создать панель автопарка');

export type ExecuteOptions = {
	config: ConfigType;
	updateCarParkPanel: () => Promise<void>;
};

export async function execute(
	interaction: ChatInputCommandInteraction,
	{ config, updateCarParkPanel }: ExecuteOptions,
): Promise<boolean> {
	if (!interaction.channel?.isSendable()) return false;

	if (interaction.channelId !== config.channels.carpark) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале автопарка.',
		});
		return true;
	}

	const msg = await interaction.channel.send({
		embeds: [
			new EmbedBuilder({
				title: 'Загрузка панели...',
				color: 0x5865f2,
			}),
		],
	});

	const panels = await loadAsync(config.files.panels);
	panels.carpark = {
		channelId: interaction.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateCarParkPanel();

	await safeReply(interaction, {
		content: '✅ Панель создана!',
	});

	return true;
}

module.exports = {
	data,
	execute,
};
