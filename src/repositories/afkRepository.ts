import { config } from '../config.js';
import { AfkUserInfo } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

interface AfkRepositoryInterface {
	getAll: () => Promise<Record<string, AfkUserInfo>>;
	get: (userId: string) => Promise<AfkUserInfo>;
	has: (userId: string) => Promise<boolean>;
	set: (userId: string, entry: any) => Promise<AfkUserInfo>;
	remove: (userId: string) => Promise<boolean>;
}

class AfkRepository implements AfkRepositoryInterface {
	private readonly pathToRepository = config.files.afk;

	async getAll() {
		return loadAsync(this.pathToRepository);
	}
	async get(userId: string) {
		const data: Record<string, AfkUserInfo> = await loadAsync(
			this.pathToRepository,
		);
		return data[userId];
	}
	async has(userId: string) {
		const data = await this.get(userId);
		return data ? true : false;
	}
	async set(userId: string, entry: AfkUserInfo) {
		const data = await loadAsync(this.pathToRepository);
		data[userId] = entry;
		await saveAsync(this.pathToRepository, data);
		return entry;
	}
	async remove(userId: string) {
		const data = await loadAsync(this.pathToRepository);
		const existed = Boolean(data[userId]);
		delete data[userId];
		await saveAsync(this.pathToRepository, data);
		return existed;
	}
}
export const afkRepository = new AfkRepository();
