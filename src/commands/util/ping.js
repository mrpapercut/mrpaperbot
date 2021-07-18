module.exports = {
    name: 'ping',
    description: 'Ping',
    guildOnly: false,
    execute(message, args) {
        message.channel.send('Ping');
    }
}
