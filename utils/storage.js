const fs = require('fs');
const fsp = require('fs').promises;

function ensureJsonFile(file) {
	if (!fs.existsSync(file)) fs.writeFileSync(file, '{}', 'utf8');
}

function load(file) {
	ensureJsonFile(file);

	const raw = fs.readFileSync(file, 'utf8');
	if (!raw.trim()) return {};

	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch (e) {
		throw new Error(`Failed to parse JSON in ${file}: ${e.message}`);
	}
}

function save(file, data) {
	ensureJsonFile(file);
	fs.writeFileSync(file, JSON.stringify(data ?? {}, null, 2), 'utf8');
}

async function loadAsync(file) {
	await ensureJsonFile(file);

	const raw = await fsp.readFile(file, 'utf8');
	if (!raw.trim()) return {};

	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch (e) {
		throw new Error(`Failed to parse JSON in ${file}: ${e.message}`);
	}
}

async function saveAsync(file, data) {
	await ensureJsonFile(file);
	await fsp.writeFile(file, JSON.stringify(data ?? {}, null, 2), 'utf8');
}

module.exports = { load, save, loadAsync, saveAsync };
