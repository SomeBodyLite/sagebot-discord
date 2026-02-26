import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { sendLog } from './utils/logging.js';
import { config, token } from './config.js';
import { createInteractionHandler } from './handlers/interactionCreate.js';
import { registerGuildCommands } from './services/commandRegistry.js';
import Logger from './utils/logger.js';
import { afkRepository, carParkRepository } from './repositories/index.js';
import { updateCarParkPanel } from './ui/panels/car-park.js';
import { updateAfkPanel } from './ui/panels/afk.js';
import loadModules from './services/loadModules.js';

const logger = new Logger();
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function main() {
	await loadModules();
	await registerGuildCommands();

	client.on('interactionCreate', createInteractionHandler());

	client.once('clientReady', () => {
		logger.succes(`${client.user?.tag} готов.`);

		setInterval(async () => {
			const data = await afkRepository.getAll();
			const now = Date.now();
			let changed = false;

			for (const userId in data) {
				if (data[userId].until && now >= data[userId].until) {
					await sendLog(
						client,
						config.channels.afkLog,
						`⏰ <@${userId}> автоматически вышел из АФК (время истекло).\n┕ Оставлял перса: **${data[userId].location}**`,
					);

					await afkRepository.remove(userId);
					changed = true;
				}
			}

			if (changed) {
				await updateAfkPanel();
			}
		}, 60000);

		setInterval(async () => {
			const cars = await carParkRepository.getAll();
			const now = Date.now();
			let changed = false;

			for (const car of cars) {
				if (!car.taked_At || !car.who_take) continue;
				const TWO_HOURS = 2 * 60 * 60 * 1000;
				const releaseTime = car.taked_At + TWO_HOURS;

				if (now >= releaseTime) {
					await carParkRepository.update(car.id, {
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
							logger.error(
								`Не удалось отправить DM пользователю ${car.who_take}: ${e.message}`,
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

	client.login(token);
}

main().catch(console.error);
