import { config } from '../config.js';
import { InactiveUserInfo } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

interface InactiveRepositoryInterface {
	getAll: () => Promise<Record<string, InactiveUserInfo>>;
	get: (userId: string) => Promise<InactiveUserInfo>;
	has: (userId: string) => Promise<boolean>;
	set: (userId: string, entry: InactiveUserInfo) => Promise<InactiveUserInfo>;
	remove: (userId: string) => Promise<boolean>;
}
export class InactiveRepository implements InactiveRepositoryInterface {
	private readonly pathToRepository = config.files.inactive;
	async getAll() {
		return loadAsync(this.pathToRepository);
	}
	async get(userId: string) {
		const data = await loadAsync(this.pathToRepository);
		return data[userId];
	}
	async has(userId: string) {
		return Boolean(await this.get(userId));
	}
	async set(userId: string, entry: InactiveUserInfo) {
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
export const inactiveRepository = new InactiveRepository();
