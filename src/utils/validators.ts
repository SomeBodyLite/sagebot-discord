export function isValidLength(
	value: string,
	{ min, max }: { min: number; max: number },
) {
	const len = value.trim().length;
	return len >= min && len <= max;
}
