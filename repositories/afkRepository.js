const { loadAsync, saveAsync } = require('../utils/storage');

function createAfkRepository(filePath) {
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

module.exports = { createAfkRepository };
