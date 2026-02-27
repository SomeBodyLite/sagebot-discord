export function isValidTime(time: string) {
	return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function isValidDateStrict(date: string): boolean {
	if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return false;

	const [dd, mm, yyyy] = date.split('.').map(Number);
	if (
		!Number.isInteger(dd) ||
		!Number.isInteger(mm) ||
		!Number.isInteger(yyyy)
	)
		return false;
	if (yyyy < 1970 || yyyy > 2100) return false;
	if (mm < 1 || mm > 12) return false;

	const daysInMonth = new Date(yyyy, mm, 0).getDate();
	return dd >= 1 && dd <= daysInMonth;
}

export function isValidDate(date: string) {
	if (!isValidDateStrict(date)) return false;
	const [dd, mm, yyyy] = date.split('.').map(Number);

	const inputDate = new Date(yyyy, mm - 1, dd);
	inputDate.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return inputDate.getTime() > today.getTime();
}

export function getMskNow() {
	return new Date();
}
export function formatMskTime(date: Date) {
	return date.toLocaleTimeString('ru-RU', {
		timeZone: 'Europe/Moscow',
		hour: '2-digit',
		minute: '2-digit',
	});
}
export function isTomorrow(timestamp: number) {
	const now = new Date(
		new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
	);

	const target = new Date(timestamp);

	const nowDay = now.getDate();
	const targetDay = new Date(
		target.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
	).getDate();

	return targetDay !== nowDay;
}
export function formatMskDateTime(date: Date) {
	return date.toLocaleString('ru-RU', {
		timeZone: 'Europe/Moscow',
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}

export function convertMskTimeToNextTimestamp(timeStr: string) {
	const now = new Date();

	const mskNow = new Date(
		now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
	);

	const year = mskNow.getFullYear();
	const month = String(mskNow.getMonth() + 1).padStart(2, '0');
	const day = String(mskNow.getDate()).padStart(2, '0');

	let target = new Date(`${year}-${month}-${day}T${timeStr}:00+03:00`);

	if (target.getTime() <= Date.now()) {
		target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
	}

	return target.getTime();
}
