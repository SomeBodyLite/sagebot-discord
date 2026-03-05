import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	quote,
	bold,
	codeBlock,
	inlineCode,
} from 'discord.js';
import { updatePanel } from './utils.js';
import { afkRepository } from '@/repositories/afkRepository.js';
import { AfkUserInfo } from '@/types/index.js';
import {
	isTomorrow,
	formatMskDateTime,
	formatMskTime,
	getMskNow,
} from '@/utils/time.js';
import { config } from '@/config.js';
import { client } from '@/index.js';
import { getUserUsernames } from '@/utils/tools.js';

async function buildAfkEmbed(): Promise<EmbedBuilder> {
	const data = await afkRepository.getAll();
	const users: [string, AfkUserInfo][] = Object.entries(data);

	const description =
		users.length === 0
			? 'Сейчас никто не в АФК.'
			: `Всего в АФК: **${users.length}**\n\n` +
				(
					await Promise.all(
						users.map(async ([id, info], idx) => {
							const returnDate = new Date(info.until);
							const returnText = isTomorrow(info.until)
								? formatMskDateTime(returnDate)
								: formatMskTime(returnDate);

							const user = await client.users.fetch(id);
							const usernameString = await getUserUsernames(user);

							return `${idx + 1}. ${usernameString}
${quote(`Причина: ${bold(info.reason)}`)}
${quote(`Где: ${bold(info.location)}`)}
${quote(`Вернусь: ${bold(returnText)} МСК`)}`;
						}),
					)
				).join('\n');

	return new EmbedBuilder()
		.setTitle(
			`🕒 Люди в АФК | состояние на ${formatMskTime(getMskNow())} МСК`,
		)
		.setColor(0xaa0000)
		.setImage(config.bannerUrl)
		.setDescription(description);
}

function buildAfkRow() {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: 'go_afk',
			label: 'Уйти в АФК',
			style: ButtonStyle.Success,
		}),
		new ButtonBuilder({
			customId: 'back_afk',
			label: 'Вернуться',
			style: ButtonStyle.Secondary,
		}),
	);
}
export async function updateAfkPanel() {
	return updatePanel({
		panelKey: 'afk',
		buildEmbed: buildAfkEmbed,
		buildRow: buildAfkRow,
	});
}
