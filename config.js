const path = require('path');

const DATA_FILE = path.join(__dirname, './data/afkData.json');
const INACTIVE_DATA_FILE = path.join(__dirname, './data/inactiveData.json');
const PANEL_FILE = path.join(__dirname, './data/panelData.json');

const BANNER_URL = 'https://i.ibb.co/RdZ7SXt/photo-2025-11-12-00-31-24.jpg';

const AFK_LOG_CHANNEL_ID = '1475560132434723064';
const INACTIVE_LOG_CHANNEL_ID = '1475560298839801856';

const AFK_PANEL_CHANNEL_ID = '1475560107143073874';
const INACTIVE_PANEL_CHANNEL_ID = '1475560177842524250';

module.exports = {
	files: {
		afk: DATA_FILE,
		inactive: INACTIVE_DATA_FILE,
		panels: PANEL_FILE,
	},
	BANNER_URL,
	channels: {
		afkLog: AFK_LOG_CHANNEL_ID,
		inactiveLog: INACTIVE_LOG_CHANNEL_ID,
		afkPanel: AFK_PANEL_CHANNEL_ID,
		inactivePanel: INACTIVE_PANEL_CHANNEL_ID,
	},
};
