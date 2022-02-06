import { Message } from 'discord.js';

import {default as modules} from './modules';
import BotModule from './modules/BotModule';

class MrPaperbot {
    commands: Map<string, BotModule>;

    commandPrefix: string;

    constructor() {
        this.commandPrefix = '.';

        this.initializeCommands();
    }

    private initializeCommands() {
        this.commands = new Map();

        for (const mod in modules) {
            const initializedModule = new modules[mod]();

            initializedModule.commandConfig.aliases.forEach(alias => {
                this.commands.set(alias, initializedModule);
            });
        }
    }

    public async handleMessage(message: Message): Promise<void> {
        const messageContent = message.content;

        if (!messageContent.startsWith(this.commandPrefix)) return;

        const [, messageCommand] = messageContent.match(new RegExp(`^\\${this.commandPrefix}([A-Za-z]+)`));
        const messageArgs = messageContent.replace(new RegExp(`^[${this.commandPrefix}\\w+]+`), '').trim();

        if (this.commands.has(messageCommand)) {
            const mod = this.commands.get(messageCommand);

            if (mod.isDisabled) {
                await message.channel.send('This command is disabled');
                return;
            }

            if (mod.isOwnerOnly && message.author.id !== process.env.BOT_OWNER_ID) {
                await message.channel.send('This command is only available to Owners');
                return;
            }

            if (mod.isGuildOnly && message.channel.type === 'DM') {
                await message.channel.send('This command is unavailable in DMs');
                return;
            }

            if (mod.isDmOnly && message.channel.type !== 'DM') {
                await message.channel.send('This command is only available in DMs');
                return;
            }

            await mod.handleMessage(message, messageArgs);
            return;
        }
    }
}

export default MrPaperbot;
