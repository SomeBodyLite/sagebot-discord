import { fileURLToPath } from 'url';
import 'dotenv/config';

const DATA_FILE = fileURLToPath(
	new URL('./data/afkData.json', import.meta.url),
);
const INACTIVE_DATA_FILE = fileURLToPath(
	new URL('./data/inactiveData.json', import.meta.url),
);
const PANEL_FILE = fileURLToPath(
	new URL('./data/panelData.json', import.meta.url),
);
const CARPARK_FILE = fileURLToPath(
	new URL('./data/carsParkData.json', import.meta.url),
);

function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is required`);
	}
	return value;
}

export const token = getEnv('TOKEN');
export const clientId = getEnv('CLIENT_ID');
export const guildId = getEnv('GUILD_ID');

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
		carparkLog: string;
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
		carparkLog: CAR_PANEL_CHANNEL_ID,
	},
};
