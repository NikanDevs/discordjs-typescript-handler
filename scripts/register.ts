import { REST } from '@discordjs/rest';
import { ApplicationCommandType, Routes } from 'discord-api-types/v9';
import { interactions } from '../src/interactions';
require('dotenv').config();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN.toString());

(async () => {
	const commands = Object.values(interactions).map((interaction) => {
		if (
			(interaction.type as number) === ApplicationCommandType.User ||
			(interaction.type as number) === ApplicationCommandType.Message
		)
			delete interaction.description;

		return interaction;
	});

	if (process.env.GUILD_ID === undefined) {
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});
		console.log('Register interactions globally');
	} else {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
			body: commands,
		});
		console.log('Register interactions to guild ' + process.env.GUILD_ID);
	}
})();
