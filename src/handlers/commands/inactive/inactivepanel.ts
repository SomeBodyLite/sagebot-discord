import { config } from '@/config.js';
import { updateInactivePanel } from '@/ui/panels/inactive.js';
import { safeReply } from '@/utils/safeReply.js';
import { loadAsync, saveAsync } from '@/utils/storage.js';
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';

async function execute(
	interaction: ChatInputCommandInteraction,
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
export default {
	data: new SlashCommandBuilder()
		.setName('inactivepanel')
		.setDescription('Создать панель инактива'),
	execute,
};
