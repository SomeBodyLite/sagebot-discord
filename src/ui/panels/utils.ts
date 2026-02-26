import { config } from '@/config.js';
import { client } from '@/index.js';
import Logger from '@/utils/logger.js';
import { loadAsync } from '@/utils/storage.js';
import { EmbedBuilder } from 'discord.js';

//----------------------------------------------------------------------
// Утилита обновления сообщения с панелью
//----------------------------------------------------------------------
const logger = new Logger('Update Panel Service');
export async function updatePanel({
	panelKey,
	buildEmbed,
	buildRow,
}: {
	panelKey: string;
	buildEmbed: () => Promise<EmbedBuilder>;
	buildRow: () => any;
}) {
	const panels = await loadAsync(config.files.panels);
	const meta = panels[panelKey];
	if (!meta?.channelId || !meta?.messageId) {
		console.error('нет channelId или messageId');
		return;
	}

	try {
		const channel = await client.channels.fetch(meta.channelId);
		if (!channel || !channel.isTextBased()) return;

		const message = await channel.messages.fetch(meta.messageId);
		const embed = await buildEmbed();
		const row = buildRow();
		await message.edit({ embeds: [embed], components: [row] });
	} catch (e) {
		if (e instanceof Error) {
			logger.error(`${panelKey} Panel update error: ${e?.message}`);
		} else {
			logger.error(`${panelKey} Panel update error: ${e}`);
		}
	}
}
