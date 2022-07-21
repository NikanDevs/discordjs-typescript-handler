import { Event } from '../../structures/Event';
import { client } from '../..';
import {
	CommandInteractionOptionResolver,
	GuildMember,
	Collection,
	ContextMenuCommandInteraction,
	EmbedBuilder,
	Colors,
} from 'discord.js';
const cooldown = new Collection();

export default new Event('interactionCreate', async (interaction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.inCachedGuild()) return;

	if (interaction?.isContextMenuCommand()) {
		const member = interaction.member as GuildMember;
		const command = client.commands.get(interaction.commandName);

		if (!command)
			return interaction.reply({
				embeds: [
					{
						description: `No context menus were found matching \`${interaction.commandName}\``,
						color: Colors.Red,
					},
				],
				ephemeral: true,
			});

		// Permission Check
		if (command.interaction.permission?.some((perm) => !member.permissions.has(perm)))
			return interaction.reply({
				embeds: [
					{
						description: "You don't have permissions to use this context-menu.",
						color: Colors.Red,
					},
				],
				ephemeral: true,
			});

		// Cooldowns
		if (cooldown.has(`${command.interaction.name}${interaction.user.id}`)) {
			// const cooldownRemaining = ~~(
			// 	+cooldown.get(`${command.interaction.name}${interaction.user.id}`) - +Date.now()
			// );
			const cooldownEmbed = new EmbedBuilder()
				.setColor(Colors.Red)
				.setDescription('Please wait before using this context-menu again.');

			return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		}

		await command.excute({
			client: client,
			interaction: interaction as ContextMenuCommandInteraction,
			options: interaction.options as CommandInteractionOptionResolver,
		});

		if (command.interaction.cooldown) {
			cooldown.set(
				`${command.interaction.name}${interaction.user.id}`,
				Date.now() + command.interaction.cooldown
			);
			setTimeout(() => {
				cooldown.delete(`${command.interaction.name}${interaction.user.id}`);
			}, command.interaction.cooldown);
		}
	}
});

