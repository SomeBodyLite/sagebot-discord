import { Car } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

export interface CarParkRepository {
	getAll: () => Promise<Car[]>;
	get: (id: string) => Promise<Car | undefined>;
	getAllFree: () => Promise<Car[]>;
	update: (id: string, entry: Car) => Promise<void>;
	remove: (id: string) => Promise<void>;
}

export function createCarParkRepository(filePath: string): CarParkRepository {
	return {
		async getAll() {
			return loadAsync(filePath);
		},
		async get(id) {
			const data: Car[] = await loadAsync(filePath);
			return data.find((element) => element.id === id);
		},
		async getAllFree() {
			const data: Car[] = await loadAsync(filePath);
			const filteredCars = data.filter((car) => !car.who_take);
			return filteredCars;
		},
		async update(id, entry) {
			const data: Car[] = await loadAsync(filePath);

			const index = data.findIndex((item) => item.id === id);

			if (index === -1) {
				throw new Error(`Entity with id ${id} not found`);
			}

			data[index] = {
				...data[index],
				...entry,
			};

			await saveAsync(filePath, data);

			return;
		},
		async remove(id) {
			const data = await loadAsync(filePath);
			delete data[id];
			await saveAsync(filePath, data);
			return;
		},
	};
}
