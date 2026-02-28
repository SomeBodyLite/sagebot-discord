import { Client, EmbedBuilder } from "discord.js";

export async function sendLog(
  client: Client,
  channelId: string,
  message: string,
  title?: string,
): Promise<void> {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    if (!channel.isSendable()) return;

    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor(0x2f3136)
      .setTimestamp();

    if (title) {
      embed.setTitle(title);
    }

    await channel.send({ embeds: [embed] });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
}
