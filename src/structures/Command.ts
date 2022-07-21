import { commandType } from '../typings';

export class Command {
	constructor(interaction: commandType) {
		Object.assign(this, interaction);
	}
}

