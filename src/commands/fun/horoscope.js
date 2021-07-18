import Horoscope from '~/modules/Horoscope';

module.exports = {
    name: 'horoscope',
    aliases: ['horo', 'horoscoop'],
    description: 'Shows today\'s horoscope',
    guildOnly: false,
    ownerOnly: false,
    dmOnly: false,
    execute(message, args) {
        const horoscope = new Horoscope();

        horoscope.handleMessage(message, args);
    }
}
