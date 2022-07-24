import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

// Logger

export interface LoggerClientOptions {
	timezone: string;
}

export interface LoggerDataOptions {
	source?: 'unhandledRejection' | 'uncaughtException' | 'warning' | any;
	reason?: Error;
	showDate?: boolean;
	space?: boolean;
}

// Command Interaction

export interface excuteOptions {
	client?: ExtendedClient;
	interaction?: CommandInteraction;
	options?: CommandInteractionOptionResolver;
}

type excuteFunction = (options: excuteOptions) => any;

type commandDirectories = 'utility';

export type interactionOptions = {
	name: string;
	description: string;
	directory: commandDirectories;
	cooldown?: number;
	permission?: PermissionResolvable[];
} & ChatInputApplicationCommandData;

export type commandType = {
	interaction: interactionOptions;
	excute: excuteFunction;
};
