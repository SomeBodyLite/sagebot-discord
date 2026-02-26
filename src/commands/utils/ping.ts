import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { safeReply } from '../../utils/safeReply.js';
import { Command } from '../../types/Command.js';

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Тест работоспособности');

async function execute(
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	if (!interaction.channel?.isSendable()) return;

	await safeReply(interaction, {
		content: 'Pong!',
	});

	return;
}
const command: Command = {
	data,
	execute,
};
export default command;
