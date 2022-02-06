import { Message } from 'discord.js';

import BotModule from '../BotModule';

class PingModule extends BotModule {
    constructor() {
        super();

        this.commandConfig = Object.assign({}, this.defaultCommandConfig, {
            name: 'Ping',
            aliases: ['ping'],
            ownerOnly: true
        });
    }

    handleMessage(message: Message): void {
        message.channel.send('Pong');
    }
}

export default PingModule;
