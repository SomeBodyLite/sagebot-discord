import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
	data: SlashCommandBuilder;
	execute: (
		interaction: ChatInputCommandInteraction,
		options: any,
	) => Promise<void>;
}
