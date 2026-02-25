const { safeReply } = require('../utils/safeReply');

async function handleStringSelectMenu(
	i,
	{
		client,
		config,
		afkRepo,
		inactiveRepo,
		carParkRepo,
		updateAfkPanel,
		updateInactivePanel,
		updateCarParkPanel,
	},
) {
	if (!i.isStringSelectMenu()) return false;
}

module.exports = { handleStringSelectMenu };
