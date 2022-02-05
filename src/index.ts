import * as path from 'path';
import * as dotenv from 'dotenv';
import {Client, Intents, Collection, ClientOptions} from 'discord.js';

dotenv.config({
    path: path.join(__dirname, '../.env')
});

const botToken: string = process.env.DISCORD_BOT_TOKEN;

const clientOptions: ClientOptions = {
    intents: [Intents.FLAGS.GUILDS]
};

const client = new Client(clientOptions);
const commands = new Collection();

client.once('ready', () => {
    console.log('Bot is listening');
});

client.login(botToken);
