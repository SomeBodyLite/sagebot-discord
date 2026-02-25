import { Interaction, InteractionReplyOptions } from "discord.js";

const { MessageFlags } = require('discord.js');

export async function safeReply(i: Interaction, payload: InteractionReplyOptions) {
	if (!i?.isRepliable?.()) return;

	payload.flags = payload.flags ?? MessageFlags.Ephemeral;

	try {
		if (i.deferred || i.replied) return await i.followUp(payload);
		return await i.reply(payload);
	} catch {
		// ignore secondary failures (e.g. "Unknown interaction")
	}
}

