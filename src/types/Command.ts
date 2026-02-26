import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';

export interface Command {
	data: SlashCommandBuilder;
	execute: (
		interaction: ChatInputCommandInteraction,
		options: any,
	) => Promise<void>;
}
export interface ButtonHandler {
	id: string;
	execute: (interaction: ButtonInteraction) => Promise<void>;
}
export interface ModalHandler {
	id: string;
	execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}
