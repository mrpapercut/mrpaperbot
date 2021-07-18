module.exports = {
    name: 'ping',
    description: 'Ping',
    guildOnly: false,
    dmOnly: true,
    ownerOnly: true,
    execute(message, args) {
        message.channel.send('Ping');
    }
}
