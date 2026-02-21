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
  TextInputStyle
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DATA_FILE = "./afkData.json";
const PANEL_FILE = "./panelData.json";
const BANNER_URL = "https://i.ibb.co/RdZ7SXt/photo-2025-11-12-00-31-24.jpg";

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

function getMskNow() {
  return new Date(); // текущее время сервера
}

function formatMskTime(date) {
  return date.toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function formatMskDateTime(date) {
  return date.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function convertMSKToTimestamp(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);

  const nowMsk = getMskNow();

  const year = nowMsk.getFullYear();
  const month = String(nowMsk.getMonth() + 1).padStart(2, "0");
  const day = String(nowMsk.getDate()).padStart(2, "0");

  let target = new Date(`${year}-${month}-${day}T${timeStr}:00+03:00`);

  if (target.getTime() <= Date.now()) {
    target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
  }

  return target.getTime();
}

function isTomorrow(timestamp) {
  const now = getMskNow();
  const target = new Date(timestamp);

  const nowDay = now.getDate();
  const targetDay = new Date(
    target.toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  ).getDate();

  return targetDay !== nowDay;
}

// ================= PANEL UPDATE =================

async function updatePanel() {
  const panel = load(PANEL_FILE);
  const data = load(DATA_FILE);

  if (!panel.channelId || !panel.messageId) return;

  const channel = await client.channels.fetch(panel.channelId);
  const message = await channel.messages.fetch(panel.messageId);

  const nowMsk = getMskNow();
  const currentTime = formatMskTime(nowMsk);

  const embed = new EmbedBuilder()
    .setTitle(`🕒 Люди в АФК | на ${currentTime} МСК`)
    .setColor(0xaa0000)
    .setImage(BANNER_URL)
    .setTimestamp();

  const users = Object.entries(data);

  if (users.length === 0) {
    embed.setDescription("Сейчас никто не в АФК.");
  } else {
    // сортировка по времени возврата
    users.sort((a, b) => a[1].until - b[1].until);

    let description = `Всего в АФК: **${users.length}**\n\n`;

    users.forEach(([userId, info], index) => {
      const returnDate = new Date(info.until);

      const returnText = isTomorrow(info.until)
        ? formatMskDateTime(returnDate)
        : formatMskTime(returnDate);

      description +=
        `${index + 1}) <@${userId}> — ` +
        `Причина: ${info.reason} — ` +
        `Вернётся: **${returnText}**\n`;
    });

    embed.setDescription(description);
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("go_afk")
      .setLabel("Выйти в АФК")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("back_afk")
      .setLabel("Вернуться с АФК")
      .setStyle(ButtonStyle.Primary)
  );

  await message.edit({ embeds: [embed], components: [row] });
}

// ================= COMMAND =================

const commands = [
  new SlashCommandBuilder()
    .setName("afkpanel")
    .setDescription("Создать панель АФК")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
})();

// ================= READY =================

client.on("ready", () => {
  console.log(`Бот запущен как ${client.user.tag}`);

  setInterval(() => {
    const data = load(DATA_FILE);
    const now = Date.now();
    let changed = false;

    for (const userId in data) {
      if (data[userId].until && now >= data[userId].until) {
        delete data[userId];
        changed = true;
      }
    }

    if (changed) {
      save(DATA_FILE, data);
      updatePanel();
    }
  }, 60000);
});

// ================= INTERACTIONS =================

client.on("interactionCreate", async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "afkpanel") {

      const embed = new EmbedBuilder()
        .setTitle("🕒 Люди в АФК")
        .setDescription("Сейчас никто не в АФК.")
        .setColor(0xaa0000)
        .setImage(BANNER_URL)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("go_afk")
          .setLabel("Выйти в АФК")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("back_afk")
          .setLabel("Вернуться с АФК")
          .setStyle(ButtonStyle.Primary)
      );

      const message = await interaction.channel.send({
        embeds: [embed],
        components: [row]
      });

      save(PANEL_FILE, {
        channelId: interaction.channel.id,
        messageId: message.id
      });

      await interaction.reply({
        content: "✅ Панель создана.",
        ephemeral: true
      });
    }
  }

  if (interaction.isButton()) {

    if (interaction.customId === "go_afk") {

      const modal = new ModalBuilder()
        .setCustomId("afk_modal")
        .setTitle("Выйти в АФК");

      const reasonInput = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Причина")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const timeInput = new TextInputBuilder()
        .setCustomId("time")
        .setLabel("Во сколько вернёшься? (HH:MM МСК)")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("20:10")
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(reasonInput),
        new ActionRowBuilder().addComponents(timeInput)
      );

      await interaction.showModal(modal);
    }

    if (interaction.customId === "back_afk") {
      const data = load(DATA_FILE);

      if (!data[interaction.user.id]) {
        return interaction.reply({
          content: "Ты не в АФК.",
          ephemeral: true
        });
      }

      delete data[interaction.user.id];
      save(DATA_FILE, data);

      await interaction.reply({
        content: "🔵 Ты вернулся из АФК.",
        ephemeral: true
      });

      updatePanel();
    }
  }

  if (interaction.isModalSubmit()) {

    if (interaction.customId === "afk_modal") {

      const reason = interaction.fields.getTextInputValue("reason");
      const time = interaction.fields.getTextInputValue("time");

      if (!isValidTime(time)) {
        return interaction.reply({
          content: "❌ Формат времени: HH:MM (например 08:50)",
          ephemeral: true
        });
      }

      const untilTimestamp = convertMSKToTimestamp(time);

      const data = load(DATA_FILE);

      data[interaction.user.id] = {
        reason,
        time,
        until: untilTimestamp
      };

      save(DATA_FILE, data);

      await interaction.reply({
        content: `🟡 Ты ушёл в АФК до ${time} (МСК).`,
        ephemeral: true
      });

      updatePanel();
    }
  }
});

client.login(process.env.TOKEN);