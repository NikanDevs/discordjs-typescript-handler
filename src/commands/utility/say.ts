import { Colors, EmbedBuilder } from 'discord.js';
import { interactions } from '../../interactions';
import { Command } from '../../structures/Command';

export default new Command({
	interaction: interactions.say,
	excute: async ({ interaction, options }) => {
		const message: string = options.getString('message');
		const embed = new EmbedBuilder().setDescription(message).setColor(Colors.Aqua);

		await interaction.reply({ embeds: [embed] });
	},
});
