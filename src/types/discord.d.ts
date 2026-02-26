import { Collection } from 'discord.js';
import { Command } from './Command';
import { ButtonHandler, ModalHandler } from './Command.ts';

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, Command>;
		buttons: Collection<string, ButtonHandler>;
		modals: Collection<string, ModalHandler>;
	}
}
