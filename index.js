require('dotenv').config();

const config = require('./config');
const { sendLog } = require('./utils/logging');
const { createAfkRepository } = require('./repositories/afkRepository');
const {
	createInactiveRepository,
} = require('./repositories/inactiveRepository');
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
//
// Сервис обновления/отрисовки панелей
const panelService = createPanelService({
	client,
	config,
	afkRepo,
	inactiveRepo,
});
const { updateAfkPanel, updateInactivePanel } = panelService;

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
		updateAfkPanel,
		updateInactivePanel,
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
});
client.login(process.env.TOKEN);
