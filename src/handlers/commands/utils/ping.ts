import { safeReply } from '@/utils/safeReply.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

async function execute(
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;

	await safeReply(interaction, {
		content: 'Pong!',
	});

	return;
}
export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Тест работоспособности'),
	execute,
};
