import { Client, Collection, ClientEvents } from 'discord.js';
import { commandType } from '../typings';
import { Event } from './Event';
import { readdirSync } from 'fs';

export class ExtendedClient extends Client {
	public commands: Collection<string, commandType> = new Collection();

	constructor() {
		super({
			intents: 131071,
			partials: [],
			failIfNotExists: true,
			allowedMentions: { repliedUser: false },
		});

		this.born();
	}

	private async born() {
		await this.registerModules();

		await this.login(process.env.DISCORD_TOKEN).then(() => {
			this.handlerErrors();
		});
	}

	private async importFiles(filePath: string) {
		return (await import(filePath))?.default;
	}

	/** Registers commands and events if called. */
	private async registerModules() {
		// Commands
		console.log('Registering commands...');
		for (const category of readdirSync(`${__dirname}/../commands`)) {
			for (const fileName of readdirSync(`${__dirname}/../commands/${category}`)) {
				const filePath = `${__dirname}/../commands/${category}/${fileName}`;
				const command: commandType = await this.importFiles(filePath.toString());

				this.commands.set(command.interaction.name, command);
			}
		}
		console.log('Registered commands');

		// Events
		console.log('Registering events...');
		for (const category of readdirSync(`${__dirname}/../events`)) {
			if (category.endsWith('.ts') || category.endsWith('.js')) {
				const filePath = `${__dirname}/../events/${category}`;
				const event: Event<keyof ClientEvents> = await this.importFiles(
					filePath.toString()
				);
				this.on(event.event, event.run);
			} else {
				for (const fileName of readdirSync(`${__dirname}/../events/${category}`)) {
					const filePath = `${__dirname}/../events/${category}/${fileName}`;
					const event: Event<keyof ClientEvents> = await this.importFiles(
						filePath.toString()
					);
					this.on(event.event, event.run);
				}
			}
		}
		console.log('Registered events');
	}

	/** Handles process errors and exits if called. */
	private handlerErrors() {
		process.on('unhandledRejection', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('uncaughtException', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('warning', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('disconnect', () => {
			this.destroy();
		});
		process.on('beforeExit', () => {
			this.destroy();
		});
		process.on('exit', () => {
			this.destroy();
		});
	}
}

