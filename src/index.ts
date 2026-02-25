import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import { sendLog } from './utils/logging';
import { config } from './config';
import { createInteractionHandler } from './handlers/interactionCreate';
import { createPanelService } from './services/panelService';
import { createAfkRepository } from './repositories/afkRepository';
import { createInactiveRepository } from './repositories/inactiveRepository';
import { createCarParkRepository } from './repositories/carParkRepository';
import { registerGuildCommands } from './services/commandRegistry';
import { commandData } from './commands';
//
// Токен из .env
const TOKEN = process.env.TOKEN;
//
// Создание клиента
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//
// Создание репозиториев и подключение хранилищ
const afkRepo = createAfkRepository(config.files.afk);
const inactiveRepo = createInactiveRepository(config.files.inactive);
const carParkRepo = createCarParkRepository(config.files.carpark);

//
// Сервис обновления/отрисовки панелей
const panelService = createPanelService({
	client,
	config,
	afkRepo,
	inactiveRepo,
	carParkRepo,
});
const { updateAfkPanel, updateInactivePanel, updateCarParkPanel } =
	panelService;

// ================= REGISTRATION =================
registerGuildCommands({
	token: TOKEN,
	clientId: process.env.CLIENT_ID,
	guildId: process.env.GUILD_ID,
	commandData,
});
// ================= HANDLERS =================

client.on(
	'interactionCreate',
	createInteractionHandler({
		client,
		config,
		afkRepo,
		inactiveRepo,
		carParkRepo,
		updateAfkPanel,
		updateInactivePanel,
		updateCarParkPanel,
	}),
);

client.once('clientReady', () => {
	console.log(`${client.user?.tag} готов.`);

	setInterval(async () => {
		const data = await afkRepo.getAll();
		const now = Date.now();
		let changed = false;

		for (const userId in data) {
			if (data[userId].until && now >= data[userId].until) {
				await sendLog(
					client,
					config.channels.afkLog,
					`⏰ <@${userId}> автоматически вышел из АФК (время истекло).\n┕ Оставлял перса: **${data[userId].location}**`,
				);

				await afkRepo.remove(userId);
				changed = true;
			}
		}

		if (changed) {
			await updateAfkPanel();
		}
	}, 60000);

	setInterval(async () => {
		const cars = await carParkRepo.getAll();
		const now = Date.now();
		let changed = false;

		for (const car of cars) {
			if (!car.taked_At || !car.who_take) continue;
			const TWO_HOURS = 2 * 60 * 60 * 1000;
			const releaseTime = car.taked_At + TWO_HOURS;

			if (now >= releaseTime) {
				await carParkRepo.update(car.id, {
					...car,
					who_take: null,
					taked_At: null,
				});

				try {
					const user = await client.users.fetch(car.who_take);
					user.send(
						'Автомобиль был особожден по истечении 2х часов!',
					);
					sendLog(
						client,
						config.channels.carparkLog,
						`<@${car.who_take}> автоматически освободил автомобиль
┣ Название: **${car.name}**
┕ Номер: **${car.number}**
						`,
					);
				} catch (e) {
					if (e instanceof Error) {
						console.log(
							`Не удалось отправить DM пользователю ${car.who_take}:`,
							e.message,
						);
					}
				}

				changed = true;
			}
		}

		if (changed) {
			await updateCarParkPanel();
		}
	}, 6000);
});

client.login(process.env.TOKEN);
