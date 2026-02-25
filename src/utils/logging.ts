import { Client } from "discord.js";

export async function sendLog(
  client: Client,
  channelId: string,
  message: string
): Promise<void> {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    if (!channel.isSendable()) return;

    await channel.send({ content: message });
  } catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
		}
	}
}