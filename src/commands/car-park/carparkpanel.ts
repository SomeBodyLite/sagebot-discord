import { ConfigType } from '../../config.js';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { safeReply } from '../../utils/safeReply.js';
import { loadAsync, saveAsync } from '../../utils/storage.js';
import { Command } from '../../types/Command.js';

const data = new SlashCommandBuilder()
	.setName('carpanel')
	.setDescription('Создать панель автопарка');

type ExecuteOptions = {
	config: ConfigType;
	updateCarParkPanel: () => Promise<void>;
};

async function execute(
	interaction: ChatInputCommandInteraction,
	{ config, updateCarParkPanel }: ExecuteOptions,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;

	if (interaction.channelId !== config.channels.carpark) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале автопарка.',
		});
		return;
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

	return;
}
const command: Command = {
	data,
	execute,
};
export default command;
