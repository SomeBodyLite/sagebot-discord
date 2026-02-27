import { config } from '@/config.js';
import { updateAdminCarParkPanel } from '@/ui/panels/car-park-admin.js';
import { updateCarParkPanel } from '@/ui/panels/car-park.js';
import { safeReply } from '@/utils/safeReply.js';
import { loadAsync, saveAsync } from '@/utils/storage.js';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('admincarpanel')
		.setDescription(
			'Создать панель администратора для управления автопарком',
		),
	execute,
};

async function execute(
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;

	if (interaction.channelId !== config.channels.carpark) {
		await safeReply(interaction, {
			content:
				'❌ Эту команду можно использовать только в канале администратора.',
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
	panels.carparkAdmin = {
		channelId: interaction.channel.id,
		messageId: msg.id,
	};
	await saveAsync(config.files.panels, panels);

	await updateAdminCarParkPanel();

	await safeReply(interaction, {
		content: '✅ Панель создана!',
	});

	return;
}
