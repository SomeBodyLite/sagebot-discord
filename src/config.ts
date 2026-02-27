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

interface ConfigType {
	token: string;
	clientId: string;
	guildId: string;
	files: {
		afk: string;
		inactive: string;
		panels: string;
		carpark: string;
	};
	bannerUrl: string;
	channels: {
		afkLog: string;
		inactiveLog: string;
		afkPanel: string;
		inactivePanel: string;
		carpark: string;
		carparkLog: string;
		carparkAdmin: string;
	};
}
export const config: ConfigType = {
	token: getEnv('TOKEN'),
	clientId: getEnv('CLIENT_ID'),
	guildId: getEnv('GUILD_ID'),
	files: {
		afk: DATA_FILE,
		inactive: INACTIVE_DATA_FILE,
		panels: PANEL_FILE,
		carpark: CARPARK_FILE,
	},
	bannerUrl: getEnv('BANNER_URL'),
	channels: {
		afkLog: getEnv('AFK_LOG_CHANNEL_ID'),
		inactiveLog: getEnv('INACTIVE_LOG_CHANNEL_ID'),
		afkPanel: getEnv('AFK_PANEL_CHANNEL_ID'),
		inactivePanel: getEnv('INACTIVE_PANEL_CHANNEL_ID'),
		carpark: getEnv('CAR_PANEL_CHANNEL_ID'),
		carparkLog: getEnv('CAR_LOG_CHANNEL_ID'),
		carparkAdmin: getEnv('CAR_LOG_CHANNEL_ID'),
	},
};
