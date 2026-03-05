import { config } from '@/config.js';
import { updateCreateReguestInFamPanel } from '@/ui/panels/request-in-fam.js';
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

	if (interaction.channelId !== config.channels.requestInFam) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале для заявок.',
			ephemeral: true,
		});
		return;
	}

	const message = await interaction.channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('📅 Загрузка панели...')
				.setColor(0x5865f2),
		],
	});

	const panels = await loadAsync(config.files.panels);

	panels.requestInFam = {
		channelId: interaction.channel.id,
		messageId: message.id,
	};

	await saveAsync(config.files.panels, panels);
	await updateCreateReguestInFamPanel();

	await safeReply(interaction, {
		content: '✅ Панель создана!',
	});

	return;
}
export default {
	data: new SlashCommandBuilder()
		.setName('createRequestPanel')
		.setDescription('Создать панель заявок в семью'),
	execute,
};
