import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { sendLog } from "./utils/logging.js";
import { config } from "./config.js";
import { createInteractionHandler } from "./handlers/interactionCreate.js";
import Logger from "./utils/logger.js";
import { afkRepository, carParkRepository } from "./repositories/index.js";
import { updateCarParkPanel } from "./ui/panels/car-park.js";
import { updateAfkPanel } from "./ui/panels/afk.js";
import loadModules from "./services/loadModules.js";
import { updateInactivePanel } from "./ui/panels/inactive.js";

const logger = new Logger();
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function main() {
  await loadModules();

  client.on("interactionCreate", createInteractionHandler());

  client.once("clientReady", () => {
    logger.succes(`${client.user?.tag} готов.`);
    updateInactivePanel();
    updateAfkPanel();
    setInterval(async () => {
      const data = await afkRepository.getAll();
      const now = Date.now();
      let changed = false;

      for (const userId in data) {
        if (data[userId].until && now >= data[userId].until) {
          try {
            const user = await client.users.fetch(userId);
            const guild = await client.guilds.fetch(config.guildId);
            const member = await guild.members.fetch(userId).catch(() => null);
            const displayName =
              member?.displayName || user.globalName || user.username;
            const userLine = `<@${user.id}> (${displayName}, @${user.username})`;
            await sendLog(
              client,
              config.channels.afkLog,
              `${userLine}\n┕ Оставлял перса: **${data[userId].location}**`,
              "⏰ АФК время истекло",
            );
          } catch (e) {
            // Ignore fetch errors
          }

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
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        const releaseTime = car.taked_At + THREE_HOURS;

        if (now >= releaseTime) {
          await carParkRepository.update(car.id, {
            ...car,
            who_take: null,
            taked_At: null,
          });

          try {
            const user = await client.users.fetch(car.who_take);
            user.send("Автомобиль был особожден по истечении 3х часов!");

            const guild = await client.guilds.fetch(config.guildId);
            const member = await guild.members
              .fetch(car.who_take)
              .catch(() => null);
            const displayName =
              member?.displayName ||
              user.globalName ||
              user.username;
            const userLine = `<@${user.id}> (${displayName}, @${user.username})`;

            sendLog(
              client,
              config.channels.carparkLog,
              `${userLine}\n┣ Название: **${car.name}**\n┕ Номер: **${car.number}**`,
              "⏰ Автомобиль освобожден (время истекло)",
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

      await updateCarParkPanel();
    }, 60000);
  });

  client.login(config.token);
}

main().catch(console.error);
