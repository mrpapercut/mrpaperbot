declare namespace MrPaperbotNS {
    export interface Command {
        name: string,
        aliases: Array<string>,
        description?: string,
        guildOnly: boolean,
        ownerOnly: boolean,
        dmOnly: boolean,
        disabled: boolean
    }
}
