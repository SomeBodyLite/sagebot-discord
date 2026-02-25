const path = require('path');

const DATA_FILE = path.join(__dirname, './data/afkData.json');
const INACTIVE_DATA_FILE = path.join(__dirname, './data/inactiveData.json');
const PANEL_FILE = path.join(__dirname, './data/panelData.json');
const CARPARK_FILE = path.join(__dirname, './data/carsParkData.json');

const BANNER_URL = 'https://i.ibb.co/RdZ7SXt/photo-2025-11-12-00-31-24.jpg';

const AFK_LOG_CHANNEL_ID = '1475560132434723064';
const INACTIVE_LOG_CHANNEL_ID = '1475560298839801856';

const AFK_PANEL_CHANNEL_ID = '1475560107143073874';
const INACTIVE_PANEL_CHANNEL_ID = '1475560177842524250';

const CAR_PANEL_CHANNEL_ID = '1476157716442386452';
export interface ConfigType {
	files: {
		afk: string;
		inactive: string;
		panels: string;
		carpark: string;
	};
	BANNER_URL: string;
	channels: {
		afkLog: string;
		inactiveLog: string;
		afkPanel: string;
		inactivePanel: string;
		carpark: string;
	};
}
export const config: ConfigType = {
	files: {
		afk: DATA_FILE,
		inactive: INACTIVE_DATA_FILE,
		panels: PANEL_FILE,
		carpark: CARPARK_FILE,
	},
	BANNER_URL,
	channels: {
		afkLog: AFK_LOG_CHANNEL_ID,
		inactiveLog: INACTIVE_LOG_CHANNEL_ID,
		afkPanel: AFK_PANEL_CHANNEL_ID,
		inactivePanel: INACTIVE_PANEL_CHANNEL_ID,
		carpark: CAR_PANEL_CHANNEL_ID,
	},
};
