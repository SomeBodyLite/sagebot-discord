import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';
import { config, ConfigType } from '../../config.js';
import { loadAsync, saveAsync } from '../../utils/storage.js';
import { safeReply } from '../../utils/safeReply.js';
import { Command } from '../../types/Command.js';

const data = new SlashCommandBuilder()
	.setName('inactivepanel')
	.setDescription('Создать панель инактива');

type ExecuteOptions = {
	updateInactivePanel: () => Promise<void>;
};

async function execute(
	interaction: ChatInputCommandInteraction,
	{ updateInactivePanel }: ExecuteOptions,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;

	if (interaction.channelId !== config.channels.inactivePanel) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале инактива.',
			ephemeral: true,
		});
		return;
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
	});

	return;
}
const command: Command = {
	data,
	execute,
};
export default command;
