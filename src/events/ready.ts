import { Event } from '../structures/Event';

export default new Event('ready', async (client) => {
	console.log(`Logged in as ${client.user.tag}`);
});

