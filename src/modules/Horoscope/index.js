import { Origin, Horoscope as CNHoroscope } from 'circular-natal-horoscope-js';
import Discord from 'discord.js';

import MainModule from '../MainModule';

import DB from '../../util/DB';

import dbSchema from './dbSchema';
import showHelp from './showHelp';
import getHoroscope from './getHoroscope';
import getCanvasChart from './getCanvasChart';

import zodiacs from './util/zodiacs';

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
            const zodiacName = this.findZodiacByName(args[0].toLowerCase());

            if (zodiacName) {
                getHoroscope(message, zodiacName);
            } else {
                switch (args[0]) {
                    case 'register':
                        this.registerUser(message, args);
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

        /*
        const originTestChar = {
            year: 1996,
            month: 0,
            date: 17,
            hour: 18,
            minute: 25,
            latitude: 51.92,
            longitude: 4.25
        }
        */

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

    registerUser(message, args) {
        message.channel.send('registration coming soon');

        // args[0] = 'register'
        switch (args[1]) {
            case 'sign':
                // register userid + zodiac
                break;

            case 'date':
                // calculate zodiac, register user_id + zodiac + dob
                break;

            case 'time':
                // calculate zodiac, register user_id + zodiac + dob_*
                break;

            case 'location':
                // calculate zodiac, register pob_lat + pob_long
                break;

            default:
                return showHelp(message, 'unknown_option_register');
        }

        /*
        const db = new DB(dbSchema);
        db.init();

        const res = db.registerUser({
            userid: message.author.id,
            zodiac: 'sagittarius',
            dob_year: 1985,
            dob_month: 11,
            dob_day: 17,
            dob_hour: 15,
            dob_minute: 40,
            pob_lat: 52.62,
            pob_long: 4.74
        })

        message.channel.send('ok');
        */
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
