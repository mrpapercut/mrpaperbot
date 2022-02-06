import * as path from 'path';
import * as dotenv from 'dotenv';
import {Client, Intents, ClientOptions} from 'discord.js';
import MrPaperbot from './MrPaperbot';

dotenv.config({
    path: path.join(__dirname, '../.env')
});

const botToken: string = process.env.DISCORD_BOT_TOKEN;

const gatewayIntents: Intents = new Intents();
gatewayIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
);

const clientOptions: ClientOptions = {
    intents: gatewayIntents,
    shardCount: 1
};

const client = new Client(clientOptions);
const bot = new MrPaperbot();

client.once('ready', (response: Client) => {
    console.log(`Bot is listening (${response.readyAt})`);
});

client.on('messageCreate', async message => {
    // It's my message
    if (message.author.id === process.env.DISCORD_OAUTH_CLIENT_ID) return;

    await bot.handleMessage(message);
});

client.on('interactionCreate', async interaction => {
    console.log(interaction);
});

// ['apiRequest','apiResponse','channelCreate','channelDelete','channelPinsUpdate','channelUpdate','emojiCreate','emojiDelete','emojiUpdate','error','guildBanAdd','guildBanRemove','guildCreate','guildDelete','guildIntegrationsUpdate','guildMemberAdd','guildMemberAvailable','guildMemberRemove','guildMembersChunk','guildMemberUpdate','guildScheduledEventCreate','guildScheduledEventDelete','guildScheduledEventUpdate','guildScheduledEventUserAdd','guildScheduledEventUserRemove','guildUnavailable','guildUpdate','invalidated','invalidRequestWarning','inviteCreate','inviteDelete','messageDelete','messageDeleteBulk','messageReactionAdd','messageReactionRemove','messageReactionRemoveAll','messageReactionRemoveEmoji','messageUpdate','presenceUpdate','rateLimit','ready','roleCreate','roleDelete','roleUpdate','shardDisconnect','shardError','shardReady','shardReconnecting','shardResume','stageInstanceCreate','stageInstanceDelete','stageInstanceUpdate','stickerCreate','stickerDelete','stickerUpdate','threadCreate','threadDelete','threadListSync','threadMembersUpdate','threadMemberUpdate','threadUpdate','typingStart','userUpdate','voiceStateUpdate','warn','webhookUpdate'].forEach(ev => {
//     client.on(ev, () => console.log(ev));
// });

client.on('debug', msg => console.log(msg));

client.login(botToken);
