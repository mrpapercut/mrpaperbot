import { Origin, Horoscope as CNHoroscope } from 'circular-natal-horoscope-js';
import Discord from 'discord.js';

import MainModule from '../MainModule';

import DB from '../../util/DB';

import dbSchema from './dbSchema';
import showHelp from './showHelp';
import getHoroscope from './getHoroscope';
import getCanvasChart from './getCanvasChart';
import registerUser from './registerUser';

import findZodiacByName from './util/findZodiacByName';

class Horoscope extends MainModule {
    constructor(props) {
        super(props);
    }

    async handleMessage(message, args) {
        /**
         * Commands:
         * .horoscope                           Returns horoscope, gets zodiac from db
         * .horoscope <zodiac>                  Returns horoscope
         * .horoscope register <date|zodiac>    Store this user's date or zodiac
         * .horoscope help                      Show this information
         */
        if (args.length > 0) {
            // .horoscope <zodiac>
            const zodiacName = findZodiacByName(args[0].toLowerCase());

            if (zodiacName) {
                getHoroscope(message, zodiacName);
            } else {
                switch (args[0]) {
                    case 'register':
                        registerUser(message, args);
                        break;
                    case 'help':
                        showHelp(message, args);
                        break;
                    case 'chart':
                        this.getChart(message);
                        break;
                }
            }
        } else {
            const zodiacName = await this.getZodiacFromDatabase(message);

            if (zodiacName === null) {
                showHelp(message, 'user_no_zodiac_known');
            } else {
                getHoroscope(message, zodiacName);
            }
        }
    }

    async getChart(message) {
        const originTestMischa = {
            year: 1985,
            month: 11, // 0 = January, 11 = December!
            date: 17,
            hour: 15,
            minute: 40,
            latitude: 52.62,
            longitude: 4.74,
        };

        const originAtBirth = new Origin(originTestMischa);

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

    async getZodiacFromDatabase(message) {
        const db = new DB(dbSchema);
        await db.init();
        
        const res = await db.getByIndex(message.author.id);

        if (res) {
            return res.zodiac;
        } else {
            return null;
        }
    }
}

export default Horoscope;
