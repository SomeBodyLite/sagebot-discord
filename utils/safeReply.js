const { MessageFlags } = require('discord.js');

async function safeReply(i, payload) {
	if (!i?.isRepliable?.()) return;

	payload.flags = payload.flags ?? MessageFlags.Ephemeral;

	try {
		if (i.deferred || i.replied) return await i.followUp(payload);
		return await i.reply(payload);
	} catch {
		// ignore secondary failures (e.g. "Unknown interaction")
	}
}

module.exports = { safeReply };
