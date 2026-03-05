import { config } from '@/config.js';
import { client } from '@/index.js';
import { User } from 'discord.js';

export const getUserUsernames = async (user: User) => {
	const guild = await client.guilds.fetch(config.guildId);
	const member = await guild.members.fetch(user.id).catch(() => null);
	const displayName = member?.displayName || user.globalName || user.username;
	return `<@${user.id}> (${displayName}, @${user.username})`;
};
