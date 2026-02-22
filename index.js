require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DATA_FILE = "./afkData.json";
const INACTIVE_DATA_FILE = "./inactiveData.json";
const PANEL_FILE = "./panelData.json";
const BANNER_URL = "https://i.ibb.co/RdZ7SXt/photo-2025-11-12-00-31-24.jpg";

const AFK_LOG_CHANNEL_ID = "1475069595105759365";
const INACTIVE_LOG_CHANNEL_ID = "1475072661129527388";

const AFK_PANEL_CHANNEL_ID = "1475074370354286737";
const INACTIVE_PANEL_CHANNEL_ID = "1475074430416846848";

// ================= HELPERS =================

function load(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}
function isValidDate(date) {
  return /^\d{2}\.\d{2}\.\d{4}$|^\d{2}\.\d{2}$/.test(date);
}

function getMskNow() {
  return new Date();
}
function formatMskTime(date) {
  return date.toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function isTomorrow(timestamp) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }),
  );

  const target = new Date(timestamp);

  const nowDay = now.getDate();
  const targetDay = new Date(
    target.toLocaleString("en-US", { timeZone: "Europe/Moscow" }),
  ).getDate();

  return targetDay !== nowDay;
}
function formatMskDateTime(date) {
  return date.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function convertMSKToTimestamp(timeStr) {
  const now = new Date();

  const [hours, minutes] = timeStr.split(":").map(Number);

  const mskNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }),
  );

  const year = mskNow.getFullYear();
  const month = String(mskNow.getMonth() + 1).padStart(2, "0");
  const day = String(mskNow.getDate()).padStart(2, "0");

  let target = new Date(`${year}-${month}-${day}T${timeStr}:00+03:00`);

  if (target.getTime() <= Date.now()) {
    target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
  }

  return target.getTime();
}
async function sendLog(channelId, message) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;
    await channel.send(message);
  } catch (e) {
    console.log("Ошибка логирования:", e.message);
  }
}
// ================= PANELS LOGIC =================

async function updateAfkPanel() {
  const panels = load(PANEL_FILE);
  const data = load(DATA_FILE);
  if (!panels.afk?.channelId || !panels.afk?.messageId) return;

  try {
    const channel = await client.channels.fetch(panels.afk.channelId);
    const message = await channel.messages.fetch(panels.afk.messageId);
    const users = Object.entries(data);

    const embed = new EmbedBuilder()
      .setTitle(`🕒 Люди в АФК | состояние на ${formatMskTime(getMskNow())} МСК`)
      .setColor(0xaa0000)
      .setImage(BANNER_URL)
      .setDescription(
        users.length === 0
          ? "Сейчас никто не в АФК."
          : `Всего в АФК: **${users.length}**\n\n` +
              users
                .map(([id, info], i) => {
                  const returnDate = new Date(info.until);

                  const returnText = isTomorrow(info.until)
                    ? formatMskDateTime(returnDate)
                    : formatMskTime(returnDate);

                  return `${i + 1}) <@${id}> — Причина: ${info.reason}, Где: ${info.location}, Вернусь: **${returnText} МСК**`;
                })
                .join("\n"),
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("go_afk")
        .setLabel("Выйти в АФК")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("back_afk")
        .setLabel("Вернуться")
        .setStyle(ButtonStyle.Primary),
    );
    await message.edit({ embeds: [embed], components: [row] });
  } catch (e) {
    console.log("AFK Panel message not found");
  }
}

async function updateInactivePanel() {
  const panels = load(PANEL_FILE);
  const data = load(INACTIVE_DATA_FILE);
  if (!panels.inactive?.channelId || !panels.inactive?.messageId) return;

  try {
    const channel = await client.channels.fetch(panels.inactive.channelId);
    const message = await channel.messages.fetch(panels.inactive.messageId);
    const users = Object.entries(data);

    const embed = new EmbedBuilder()
      .setTitle(`📅 Список инактива`)
      .setColor(0x5865f2)
      .setImage(BANNER_URL)
      .setDescription(
        users.length === 0
          ? "В инактиве никого нет."
          : `В инактиве **${users.length}** человек:\n\n` +
              users
                .map(
                  ([id, info], i) =>
                    `${i + 1}) <@${id}> - Причина: "${info.reason}" - Вернусь: **${info.date}**`,
                )
                .join("\n"),
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("go_inactive")
        .setLabel("Уйти в инактив")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("back_inactive")
        .setLabel("Выйти из инактива")
        .setStyle(ButtonStyle.Success),
    );
    await message.edit({ embeds: [embed], components: [row] });
  } catch (e) {
    console.log("Inactive Panel message not found");
  }
}

// ================= REGISTRATION =================

const commands = [
  new SlashCommandBuilder()
    .setName("afkpanel")
    .setDescription("Создать панель АФК"),
  new SlashCommandBuilder()
    .setName("inactivepanel")
    .setDescription("Создать панель инактива"),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    ),
    { body: commands },
  );
})();

// ================= HANDLERS =================

client.on("interactionCreate", async (i) => {
  if (i.isChatInputCommand()) {
    if (i.commandName === "afkpanel" && i.channelId !== AFK_PANEL_CHANNEL_ID) {
      return i.reply({ content: "❌ Эту команду можно использовать только в канале АФК.", ephemeral: true });
    }
    if (i.commandName === "inactivepanel" && i.channelId !== INACTIVE_PANEL_CHANNEL_ID) {
      return i.reply({ content: "❌ Эту команду можно использовать только в канале инактива.", ephemeral: true });
    }

    const isAfk = i.commandName === "afkpanel";
    
    
    let msg;
    if (isAfk) {
        msg = await i.channel.send({
            embeds: [new EmbedBuilder().setTitle("🕒 Загрузка АФК...").setColor(0xaa0000)],
            components: [] 
        });
    } else {
        msg = await i.channel.send({
            embeds: [new EmbedBuilder().setTitle("📅 Загрузка инактива...").setColor(0x5865f2)],
            components: []
        });
    }

    const panels = load(PANEL_FILE);
    panels[isAfk ? "afk" : "inactive"] = {
      channelId: i.channel.id,
      messageId: msg.id,
    };
    save(PANEL_FILE, panels);

    isAfk ? await updateAfkPanel() : await updateInactivePanel();

    return i.reply({ content: "✅ Панель создана!", ephemeral: true });
  }

  if (i.isButton()) {
    if (i.customId === "go_afk") {
      const modal = new ModalBuilder()
        .setCustomId("modal_afk")
        .setTitle("Выход в АФК");
      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Причина")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("time")
            .setLabel("Время возврата ПО МСК (ЧЧ:ММ)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("location")
            .setLabel("Где оставил перса?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Например: особа, арена, казик и т.д.")
            .setRequired(true),
        ),
      );
      await i.showModal(modal);
    }

    if (i.customId === "go_inactive") {
      const modal = new ModalBuilder()
        .setCustomId("modal_inactive")
        .setTitle("Заявка на инактив");
      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Причина")
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("date")
            .setLabel("Дата возврата (ДД.ММ.ГГГГ)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("30.11.2026")
            .setRequired(true),
        ),
      );
      await i.showModal(modal);
    }

    if (i.customId === "back_afk" || i.customId === "back_inactive") {
      const isAfk = i.customId === "back_afk";
      const file = isAfk ? DATA_FILE : INACTIVE_DATA_FILE;
      const logChannel = isAfk ? AFK_LOG_CHANNEL_ID : INACTIVE_LOG_CHANNEL_ID;

      const data = load(file);

      if (!data[i.user.id])
        return i.reply({ content: "Вас нет в списке.", ephemeral: true });

      await sendLog(
        logChannel,
        `🟢 <@${i.user.id}> вернулся ${isAfk ? "из АФК" : "из инактива"} ${isAfk ? "\n Оставлял перса: **" + data[i.user.id].location + "**" : ""}`,
      );

      delete data[i.user.id];
      save(file, data);

      await i.reply({ content: "С возвращением!", ephemeral: true });

      isAfk ? updateAfkPanel() : updateInactivePanel();
    }
  }

  if (i.isModalSubmit()) {
    if (i.customId === "modal_afk") {
      const time = i.fields.getTextInputValue("time");
      if (!isValidTime(time))
        return i.reply({ content: "Формат времени: ЧЧ:ММ", ephemeral: true });

      const reason = i.fields.getTextInputValue("reason");
      const location = i.fields.getTextInputValue("location");

      const data = load(DATA_FILE);
      const untilTimestamp = convertMSKToTimestamp(time);

      const alreadyAfk = !!data[i.user.id];
      const oldData = data[i.user.id];

      data[i.user.id] = {
        reason,
        location,
        time,
        until: untilTimestamp,
      };

      save(DATA_FILE, data);

      const returnDate = new Date(untilTimestamp);
      const returnText = isTomorrow(untilTimestamp)
        ? formatMskDateTime(returnDate)
        : formatMskTime(returnDate);

      // ================= ЛОГИКА ЛОГОВ =================

      if (alreadyAfk) {
        const oldReturnDate = new Date(oldData.until);
        const oldReturnText = isTomorrow(oldData.until)
          ? formatMskDateTime(oldReturnDate)
          : formatMskTime(oldReturnDate);

        await sendLog(
          AFK_LOG_CHANNEL_ID,
          `🔄 <@${i.user.id}> ОБНОВИЛ СРОК АФК
┣ Было до: **${oldReturnText}**
┣ Стало до: **${returnText}**
┣ Локация: **${oldData.location} → ${location}**
┕ Причина: **${reason}**`,
        );
      } else {
        await sendLog(
          AFK_LOG_CHANNEL_ID,
          `🟡 <@${i.user.id}> ушёл в АФК
┣ Причина: **${reason}**
┣ Где оставил перса: **${location}**
┕ Вернётся: **${returnText}**`,
        );
      }

      await i.reply({ content: "Статус обновлен.", ephemeral: true });
      updateAfkPanel();
    }

    if (i.customId === "modal_inactive") {
      const date = i.fields.getTextInputValue("date");
      if (!isValidDate(date))
        return i.reply({
          content: "Используйте формат даты: ДД.ММ.ГГГГ",
          ephemeral: true,
        });
      const data = load(INACTIVE_DATA_FILE);
      data[i.user.id] = { reason: i.fields.getTextInputValue("reason"), date };
      save(INACTIVE_DATA_FILE, data);
      await sendLog(
        INACTIVE_LOG_CHANNEL_ID,
        `🔴 <@${i.user.id}> ушёл в инактив\n┣ Причина: **${data[i.user.id].reason}**\n┕ Возврат: **${date}**`,
      );
      await i.reply({ content: "Инактив зафиксирован.", ephemeral: true });
      updateInactivePanel();
    }
  }
});

client.on("ready", () => {
  console.log(`${client.user.tag} готов.`);

  setInterval(async () => {
    const data = load(DATA_FILE);
    const now = Date.now();
    let changed = false;

    for (const userId in data) {
      if (data[userId].until && now >= data[userId].until) {
        await sendLog(
          AFK_LOG_CHANNEL_ID,
          `⏰ <@${userId}> автоматически вышел из АФК (время истекло).\n┕ Оставлял перса: **${data[userId].location}**`,
        );

        delete data[userId];
        changed = true;
      }
    }

    if (changed) {
      save(DATA_FILE, data);
      updateAfkPanel();
    }
  }, 60000);
});
client.login(process.env.TOKEN);
