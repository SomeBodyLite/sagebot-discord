const { loadAsync, saveAsync } = require('../utils/storage');

function createCarParkRepository(filePath) {
	return {
		async getAll() {
			return loadAsync(filePath);
		},
		async get(id) {
			const data = await loadAsync(filePath);
			return data.find((element) => element.id === id);
		},
		async getAllFree() {
			const data = await loadAsync(filePath);
			const filteredCars = data.filter((car) => !car.who_take);
			return filteredCars;
		},
		async update(id, entry) {
			const data = await loadAsync(filePath);

			const index = data.findIndex((item) => item.id === id);

			if (index === -1) {
				throw new Error(`Entity with id ${id} not found`);
			}

			data[index] = {
				...data[index],
				...entry,
			};

			await saveAsync(filePath, data);

			return data[index];
		},
		async remove(id) {
			const data = await loadAsync(filePath);
			const existed = Boolean(data[id]);
			delete data[id];
			await saveAsync(filePath, data);
			return existed;
		},
	};
}

module.exports = { createCarParkRepository };
