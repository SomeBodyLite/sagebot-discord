import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (!interaction.channel?.isSendable()) return;

  const user = interaction.options.getUser('user', true);
  const messageType = interaction.options.getString('message', true);

  let text = '';

  if (messageType === 'hello') {
    text = `Привет ${user}!`;
  } else if (messageType === 'negative') {
    text = `Пошел нахуй ${user}! <3`;
  }

  await interaction.reply(text);
  
}

export default {
  data: new SlashCommandBuilder()
    .setName('sayhello')
    .setDescription('Отправить привет пользователю')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Кому отправить сообщение')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Выберите сообщение')
        .setRequired(true)
        .addChoices(
          { name: 'Доброе', value: 'hello' },
          { name: 'Негативное', value: 'negative' },
        ),
    ),

  execute,
};