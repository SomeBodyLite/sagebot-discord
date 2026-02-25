async function sendLog(client, channelId, message) {
	try {
		const channel = await client.channels.fetch(channelId);
		if (!channel) return;
		await channel.send(message);
	} catch (e) {
		console.log('Ошибка логирования:', {
			channelId,
			message: e.message,
			stack: e.stack,
		});
	}
}

module.exports = { sendLog };
