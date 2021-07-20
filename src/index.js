import path from 'path';
import fs from 'fs';
import Discord from 'discord.js';
import dotenv from 'dotenv';

import appConfig from './config.json';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const client = new Discord.Client();
client.commands = new Discord.Collection();

const pathResolve = (relCmdPath = '') => {
    return path.resolve(__dirname, './commands', relCmdPath);
}

const commandFolders = fs.readdirSync(pathResolve());

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(pathResolve(folder)).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(pathResolve(`${folder}/${file}`));
        client.commands.set(command.name, command);
    }
}

client.once('ready', () => {
    console.log('Bot listening');
});

client.on('message', message => {
    if (!message.content.startsWith(appConfig.prefix) || message.author.bot) return;

    const args = message.content.slice(appConfig.prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.ownerOnly && message.author.id !== process.env.BOT_OWNER_ID) {
        return;
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('This command is unavailable in DMs');
    }

    if (command.dmOnly && message.channel.type !== 'dm') {
        return message.reply('This command is only available in DMs');
    }

    try {
        command.execute(message, args);
    } catch (err) {
        console.error(err);
        message.reply('An error occured while executing this command');
    }

});

client.login(process.env.DISCORD_BOT_TOKEN);
