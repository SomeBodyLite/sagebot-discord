import { loadAsync, saveAsync } from '../utils/storage';

export interface AfkRepository {
	getAll: () => any;
	get: (userId: string) => any;
	has: (userId: string) => any;
	set: (userId: string, entry: any) => any;
	remove: (userId: string) => any;
}
export function createAfkRepository(filePath: string): AfkRepository {
	return {
		async getAll() {
			return loadAsync(filePath);
		},
		async get(userId) {
			const data = await loadAsync(filePath);
			return data[userId];
		},
		async has(userId) {
			const data = await this.get(userId);
			return data ? true : false;
		},
		async set(userId, entry) {
			const data = await loadAsync(filePath);
			data[userId] = entry;
			await saveAsync(filePath, data);
			return entry;
		},
		async remove(userId) {
			const data = await loadAsync(filePath);
			const existed = Boolean(data[userId]);
			delete data[userId];
			await saveAsync(filePath, data);
			return existed;
		},
	};
}
