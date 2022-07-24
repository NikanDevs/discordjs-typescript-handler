import { Collection, Colors, CommandInteractionOptionResolver, EmbedBuilder, GuildMember } from 'discord.js';
import { client } from '../..';
import { Event } from '../../structures/Event';
const cooldown = new Collection<string, number>();

export default new Event('interactionCreate', async (interaction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.inCachedGuild()) return;

	if (interaction.isChatInputCommand()) {
		const member = interaction.member as GuildMember;
		const command = client.commands.get(interaction.commandName);

		if (!command)
			return interaction.reply({
				embeds: [
					{
						description: `No commands were found matching \`/${interaction.commandName}\``,
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
						description: "You don't have permissions to use this command.",
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
				.setDescription(`Please wait before using this again.`);

			return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		}

		await command.excute({
			client: client,
			interaction: interaction,
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
