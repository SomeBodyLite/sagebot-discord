import {
	ActionRowBuilder,
	ActionRowData,
	AnyComponentBuilder,
	APIEmbed,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	TopLevelComponentData,
} from 'discord.js';
import { ConfigType } from '../config.js';
import { AfkRepository } from '../repositories/afkRepository.js';
import { InactiveRepository } from '../repositories/inactiveRepository.js';
import { CarParkRepository } from '../repositories/carParkRepository.js';
import { AfkUserInfo, Car, InactiveUserInfo } from '../types/index.js';
import { loadAsync } from '../utils/storage.js';
import {
	formatMskDateTime,
	formatMskTime,
	getMskNow,
	isTomorrow,
} from '../utils/time.js';
import Logger from '../utils/logger.js';

//----------------------------------------------------------------------
// Отрисовка Сообщений с панелями
//----------------------------------------------------------------------
export function createPanelService({
	client,
	config,
	afkRepo,
	inactiveRepo,
	carParkRepo,
}: {
	client: Client;
	config: ConfigType;
	afkRepo: AfkRepository;
	inactiveRepo: InactiveRepository;
	carParkRepo: CarParkRepository;
}) {
	const logger = new Logger('Create Panel Service');
	async function updatePanel({
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

	//----------------------------------------------------------------------
	// АФК панель билдер
	//----------------------------------------------------------------------
	async function buildAfkEmbed(): Promise<EmbedBuilder> {
		const data = await afkRepo.getAll();
		const users: [string, AfkUserInfo][] = Object.entries(data);

		const description =
			users.length === 0
				? 'Сейчас никто не в АФК.'
				: `Всего в АФК: **${users.length}**\n\n` +
					users
						.map(([id, info], idx) => {
							const returnDate = new Date(info.until);
							const returnText = isTomorrow(info.until)
								? formatMskDateTime(returnDate)
								: formatMskTime(returnDate);

							return `${idx + 1}) <@${id}> — Причина: **${info.reason}** | Где: **${info.location}** | Вернусь: **${returnText} МСК**`;
						})
						.join('\n');

		return new EmbedBuilder()
			.setTitle(
				`🕒 Люди в АФК | состояние на ${formatMskTime(
					getMskNow(),
				)} МСК`,
			)
			.setColor(0xaa0000)
			.setImage(config.BANNER_URL)
			.setDescription(description);
	}

	//----------------------------------------------------------------------
	// АФК панель кнопки
	//----------------------------------------------------------------------
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

	//----------------------------------------------------------------------
	// Inactive панель билдер
	//----------------------------------------------------------------------
	async function buildInactiveEmbed() {
		const data = await inactiveRepo.getAll();
		const users: [string, InactiveUserInfo][] = Object.entries(data);

		const description =
			users.length === 0
				? 'В инактиве никого нет.'
				: `В инактиве **${users.length}** человек:\n\n` +
					users
						.map(
							([id, info], idx) =>
								`${idx + 1}) <@${id}> - Причина: "${info.reason}" - Вернусь: **${info.date}**`,
						)
						.join('\n');

		return new EmbedBuilder()
			.setTitle('📅 Список инактива')
			.setColor(0x5865f2)
			.setImage(config.BANNER_URL)
			.setDescription(description);
	}

	//----------------------------------------------------------------------
	// Inactive панель кнопки
	//----------------------------------------------------------------------
	function buildInactiveRow() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder({
				customId: 'go_inactive',
				label: 'Уйти в инактив',
				style: ButtonStyle.Success,
			}),

			new ButtonBuilder({
				customId: 'back_inactive',
				label: 'Выйти из инактива',
				style: ButtonStyle.Secondary,
			}),
		);
	}

	//----------------------------------------------------------------------
	// CarPark панель билдер
	//----------------------------------------------------------------------
	async function buildCarParkEmbed() {
		const data: Car[] = await carParkRepo.getAll();

		const description = data
			.map((carData) => {
				if (carData.who_take) {
					return `🔒 ${carData.number} | ${carData.name} **Занял**: <@${carData.who_take}>`;
				} else {
					return `✅ ${carData.number} | ${carData.name}`;
				}
			})
			.join('\n');

		return (
			new EmbedBuilder()
				.setTitle('Автопарк')
				.setColor(0x5865f2)
				// .setImage(config.BANNER_URL)
				.setDescription(description)
		);
	}

	//----------------------------------------------------------------------
	// CarPark панель кнопки
	//----------------------------------------------------------------------
	function buildCarParkRow() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder({
				customId: 'list_cars',
				label: 'Список Авто',
				style: ButtonStyle.Success,
			}),

			new ButtonBuilder({
				customId: 'release_current',
				label: 'Освободить текущий',
				style: ButtonStyle.Danger,
			}),
		);
	}

	return {
		async updateAfkPanel() {
			return updatePanel({
				panelKey: 'afk',
				buildEmbed: buildAfkEmbed,
				buildRow: buildAfkRow,
			});
		},
		async updateInactivePanel() {
			return updatePanel({
				panelKey: 'inactive',
				buildEmbed: buildInactiveEmbed,
				buildRow: buildInactiveRow,
			});
		},
		async updateCarParkPanel() {
			return updatePanel({
				panelKey: 'carpark',
				buildEmbed: buildCarParkEmbed,
				buildRow: buildCarParkRow,
			});
		},
	};
}
