import chalk from 'chalk';

export default class Logger {
	readonly loggerName: string | undefined = undefined;
	readonly log = console.log;

	constructor(name?: string) {
		if (name !== undefined) {
			this.loggerName = name;
		}
	}

	private getCurrentTime(): string {
		const now = new Date();
		return now.toLocaleString('ru-RU', {
			timeZone: 'Europe/Moscow',
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			year: 'numeric',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		});
	}

	private write(text: string): void {
		if (this.loggerName) {
			this.log(
				`${chalk.dim(this.getCurrentTime())}: ${chalk.bgMagenta(this.loggerName)} : ${text}`,
			);
		} else {
			this.log(`${chalk.dim(this.getCurrentTime())}: ${text}`);
		}
	}

	public succes(content: string): void {
		this.write(chalk.green(content));
	}
	public info(content: string): void {
		this.write(chalk.blue(content));
	}
	public error(content: string): void {
		this.write(chalk.red.bold(content));
	}
}
