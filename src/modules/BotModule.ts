import { Message } from "discord.js";

class BotModule {
    commandConfig: MrPaperbotNS.Command;
    defaultCommandConfig: MrPaperbotNS.Command = {
        name: '',
        aliases: [],
        guildOnly: false,
        ownerOnly: false,
        dmOnly: false,
        disabled: false
    };

    public handleMessage(message: Message, args?: string): void {
        message.channel.send(`Unhandled message for ${this.commandConfig.name} (arguments: ${args})`);
    }

    public get modname(): string {
        return this.commandConfig.name;
    }

    public get isGuildOnly(): boolean {
        return this.commandConfig.guildOnly;
    }

    public get isOwnerOnly(): boolean {
        return this.commandConfig.ownerOnly;
    }

    public get isDmOnly(): boolean {
        return this.commandConfig.dmOnly;
    }

    public get isDisabled(): boolean {
        return this.commandConfig.disabled;
    }
}

export default BotModule;
