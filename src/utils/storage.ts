import fs from 'fs';
import fsp from 'fs/promises';

export function ensureJsonFile(file: string) {
	if (!fs.existsSync(file)) fs.writeFileSync(file, '{}', 'utf8');
}

export function load(file: string) {
	ensureJsonFile(file);

	const raw = fs.readFileSync(file, 'utf8');
	if (!raw.trim()) return {};

	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to parse JSON in ${file}: ${e.message}`);
		}
	}
}
// TODO: delete any
export function save(file: string, data: any) {
	ensureJsonFile(file);
	fs.writeFileSync(file, JSON.stringify(data ?? {}, null, 2), 'utf8');
}

export async function loadAsync(file: string) {
	await ensureJsonFile(file);

	const raw = await fsp.readFile(file, 'utf8');
	if (!raw.trim()) return {};

	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to parse JSON in ${file}: ${e.message}`);
		}
	}
}

export async function saveAsync(file: string, data: any) {
	await ensureJsonFile(file);
	await fsp.writeFile(file, JSON.stringify(data ?? {}, null, 2), 'utf8');
}
