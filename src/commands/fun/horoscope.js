import Horoscope from '~/modules/Horoscope';

module.exports = {
    name: 'horoscope',
    aliases: ['horo', 'horoscoop'],
    description: 'Shows today\'s horoscope',
    guildOnly: false,
    ownerOnly: true,
    execute(message, args) {
        const horoscope = new Horoscope();

        horoscope.handleMessage(message, args);
    }
}
