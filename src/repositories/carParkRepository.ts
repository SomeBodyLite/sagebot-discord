import { config } from '../config.js';
import { Car } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

interface CarParkRepositoryInterface {
	getAll: () => Promise<Car[]>;
	get: (id: string) => Promise<Car | undefined>;
	getAllFree: () => Promise<Car[]>;
	update: (id: string, entry: Car) => Promise<void>;
	remove: (id: string) => Promise<void>;
}

class CarParkRepository implements CarParkRepositoryInterface {
	private readonly pathToRepository = config.files.carpark;
	async getAll() {
		return loadAsync(this.pathToRepository) as Promise<Car[]>;
	}
	async get(id: string) {
		const data: Car[] = await loadAsync(this.pathToRepository);
		return data.find((element) => element.id === id);
	}
	async getAllFree() {
		const data: Car[] = await loadAsync(this.pathToRepository);
		const filteredCars = data.filter((car) => !car.who_take);
		return filteredCars;
	}
	async update(id: string, entry: Car) {
		const data: Car[] = await loadAsync(this.pathToRepository);

		const index = data.findIndex((item) => item.id === id);

		if (index === -1) {
			throw new Error(`Entity with id ${id} not found`);
		}

		data[index] = {
			...data[index],
			...entry,
		};

		await saveAsync(this.pathToRepository, data);

		return;
	}
	async remove(id: string) {
		const data = await loadAsync(this.pathToRepository);
		delete data[id];
		await saveAsync(this.pathToRepository, data);
		return;
	}
}
export const carParkRepository = new CarParkRepository();
