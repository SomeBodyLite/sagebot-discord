import { config } from '../config.js';
import { RequestInFam, StatusRequestInFam } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

interface requestInFamRepositoryInterface {
	getAll: () => Promise<Record<string, RequestInFam>>;
	get: (userId: string) => Promise<RequestInFam | undefined>;
	has: (userId: string) => Promise<boolean>;
	set: (userId: string, entry: any) => Promise<RequestInFam>;
	remove: (userId: string) => Promise<boolean>;
}

class RequestInFamRepository implements requestInFamRepositoryInterface {
	private readonly pathToRepository = config.files.requestInFam;

	async getAll() {
		return loadAsync(this.pathToRepository);
	}
	async get(userId: string, status?: StatusRequestInFam) {
		const data: RequestInFam[] = await loadAsync(this.pathToRepository);
		return data.find(
			(entity) =>
				entity.userId === userId &&
				(status === undefined || entity.status === status),
		);
	}
	async has(userId: string) {
		const data = await this.get(userId);
		return data ? true : false;
	}
	async set(userId: string, entry: RequestInFam) {
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
export const requestInFamRepository = new RequestInFamRepository();
