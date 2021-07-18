import axios from 'axios';
import { Origin, Horoscope as CNHoroscope } from 'circular-natal-horoscope-js';
import Discord from 'discord.js';

import MainModule from '~/modules/MainModule';

import appConfig from '~/config.json';
import {ucfirst} from '~/util/format';

import getCanvasChart from './getCanvasChart';

import zodiacs from './util/zodiacs';

class Horoscope extends MainModule {
    constructor(props) {
        super(props);
    }
    
    handleMessage(message, args) {
        /**
         * Commands:
         * .horoscope <zodiac> <date?>          Returns horoscope
         * .horoscope <date?>                   Returns horoscope, gets zodiac from db
         * .horoscope register <date|zodiac>    Store this user's date or zodiac
         * .horoscope help                      Show this information
         */
        if (args.length > 0) {
            // .horoscope <zodiac> <date?>
            const zodiacName = this.findZodiacByName(args[0].toLowerCase());

            if (zodiacName) {
                let horoscopeDate = 'today';

                if (args[1] && ['yesterday', 'tomorrow'].includes(args[1])) {
                    horoscopeDate = args[1];
                }

                this.getHoroscope(message, zodiacName, horoscopeDate);
            } else if (args[0] === 'register') {
                // TODO: Check if args[1] exists and is <date?|zodiac>
                this.registerUser(message, args[1])
            } else if (args[0] === 'help') {
                this.showHelp(message);
            } else if (args[0] === 'chart') {
                this.getChart(message);
            }
        } else {
            const zodiacName = this.getZodiacFromDatabase(message);

            // Nothing here yet
        }
    }

    findZodiacByName(term) {
        if (Object.keys(zodiacs).includes(term)) {
            return term;
        } else {
            for (let i in zodiacs) {
                if (Object.values(zodiacs[i].i18n).includes(term)) {
                    return i;
                }
            }
          
            return false;
        }
    };
    
    getHoroscope(message, zodiacsign = 'sagittarius', date = 'today') {
        axios({
            method: 'post',
            url: `https://aztro.sameerkumar.website/?sign=${zodiacsign}&day=${date}`,
            responseType: 'json'
        })
        .then(({data}) => {
            const response = {
                embed: {
                    type: 'rich',
                    color: appConfig.colors.embed,
                    timestamp: new Date,
                    title: `${ucfirst(zodiacsign)} horoscope for ${data.current_date}`,
                    description: `*"${data.description}"*`,
                    fields: [{
                        name: 'Compatible with:',
                        value: data.compatibility,
                        inline: true
                    }, {
                        name: 'Mood:',
                        value: data.mood,
                        inline: true
                    }, {
                        name: 'Color:',
                        value: data.color,
                        inline: true
                    }, {
                        name: 'Lucky number:',
                        value: data.lucky_number,
                        inline: true
                    }, {
                        name: 'Lucky time:',
                        value: data.lucky_time,
                        inline: true
                    }, {
                        name: '\u0000',
                        value: '\u0000',
                        inline: true
                    }]
                }
            };

            axios(`https://ohmanda.com/api/horoscope/${zodiacsign}`).then(({data}) => {
                response.embed.description += `\n\n*"${data.horoscope}"*`;
            }).catch(err => {
                console.error(err);
            }).then(() => {
                message.channel.send(response);
            });
        })
        .catch(err => {
            console.error(err);
            message.channel.send('Error fetching horoscope');
        });
    }

    async getChart(message) {
        const originAtBirth = new Origin({
            year: 1984,
            month: 11, // 0 = January, 11 = December!
            date: 17,
            hour: 15,
            minute: 40,
            latitude: 52.62,
            longitude: 4.74,
        });
        
        const horoscopeAtBirth = new CNHoroscope({
            origin: originAtBirth,
            houseSystem: 'placidus',
            zodiac: 'tropical',
            language: 'en'
        });

        const canvasChart = await getCanvasChart(horoscopeAtBirth);
        const attachment = new Discord.MessageAttachment(canvasChart.toBuffer(), 'chart.png');

        message.channel.send(attachment);
    }

    registerUser(message, zodiacOrDOB) {
        message.channel.send('Registration coming soon!');
    }

    showHelp(message) {
        message.channel.send('Help!');
    }

    getZodiacFromDatabase(message) {

    }
}

export default Horoscope;
