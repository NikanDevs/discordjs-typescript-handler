import { Colors } from 'discord.js';
import { interactions } from '../../interactions';
import { Command } from '../../structures/Command';

export default new Command({
	interaction: interactions.Repeat,
	excute: async ({ interaction }) => {
		if (!interaction.isMessageContextMenuCommand()) return;
		const content: string = interaction.targetMessage.content;

		if (!content.length)
			return interaction.reply({
				embeds: [
					{
						description: 'Please select a message with a content.',
						color: Colors.Red,
					},
				],
				ephemeral: true,
			});

		await interaction.reply({
			content,
		});
	},
});
