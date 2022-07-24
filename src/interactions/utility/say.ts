import { ApplicationCommandOptionType } from 'discord.js';
import { interactionOptions } from '../../typings';

export const sayCommand = {
	name: 'say',
	description: 'Says your message.',
	directory: 'utility',
	cooldown: 1000,
	permission: [],
	options: [
		{
			name: 'message',
			description: 'The message you want the bot to say',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	min_length: 10,
	max_length: 50,
} as interactionOptions;
