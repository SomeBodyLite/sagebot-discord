import { config } from '../config.js';
import { Car } from '../types/index.js';
import { loadAsync, saveAsync } from '../utils/storage.js';

interface CarParkRepositoryInterface {
	getAll: () => Promise<Car[]>;
	get: (id: string) => Promise<Car | undefined>;
	getByNumber: (number: string) => Promise<Car | undefined>;
	getAllFree: () => Promise<Car[]>;
	update: (id: string, entry: Car) => Promise<void>;
	remove: (id: string) => Promise<Car | undefined>;
	create: (car: Car) => Promise<Car>;
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
	async getByNumber(number: string) {
		const data: Car[] = await loadAsync(this.pathToRepository);
		return data.find((element) => element.number === number);
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
		const data: Car[] = await loadAsync(this.pathToRepository);
		const deletedCar = await this.get(id);
		const filtered = data.filter((car) => car.id !== id);
		await saveAsync(this.pathToRepository, filtered);
		return deletedCar;
	}

	async create(car: Car) {
		const data: Car[] = await loadAsync(this.pathToRepository);
		const existedCar = await this.getByNumber(car.number);
		if (existedCar) {
			throw new Error(`Машина с номером ${existedCar.number} уже есть`);
		}
		const lastCarId = data[data.length - 1].id;
		car = {
			...car,
			id: (Number(lastCarId) + 1).toString(),
		};
		data.push(car);
		await saveAsync(this.pathToRepository, data);
		return car;
	}
}
export const carParkRepository = new CarParkRepository();
