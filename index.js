require('dotenv').config();

const config = require('./config');
const { sendLog } = require('./utils/logging');
const { createAfkRepository } = require('./repositories/afkRepository');
const {
	createInactiveRepository,
} = require('./repositories/inactiveRepository');
const { createCarParkRepository } = require('./repositories/carParkRepository');
const { createInteractionHandler } = require('./handlers/interactionCreate');
const { createPanelService } = require('./services/panelService');
const { commandData } = require('./commands');
const { registerGuildCommands } = require('./services/commandRegistry');

const { Client, GatewayIntentBits } = require('discord.js');

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
	console.log(`${client.user.tag} готов.`);

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
			if (!car.taked_At) continue;
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
					await user.send(
						'Автомобиль был особожден по истечении 2х часов!',
					);
				} catch (err) {
					console.log(
						`Не удалось отправить DM пользователю ${car.who_take}:`,
						err.message,
					);
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
