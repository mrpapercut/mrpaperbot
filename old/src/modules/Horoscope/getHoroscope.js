import axios from 'axios';

import {ucfirst} from '../../util/format';
import appConfig from '../../config.json';

const parseLuckyTime = lt => {
    if (/am$/.test(lt)) {
        return `${parseInt(lt)}:00`.padStart(5, '0');
    } else {
        return `${parseInt(lt) + 12}:00`;
    }
}

const getHoroscope = (message, zodiacsign) => {
    axios({
        method: 'post',
        url: `https://aztro.sameerkumar.website/?sign=${zodiacsign}&day=today`,
        responseType: 'json'
    })
    .then(({data}) => {
        const response = {
            embed: {
                type: 'rich',
                color: appConfig.colors.embed,
                timestamp: new Date,
                title: `Daily horoscope for ${ucfirst(zodiacsign)}`,
                description: `*"${data.description}"*`,
                fields: [{
                    name: 'Compatible with',
                    value: data.compatibility,
                    inline: true
                }, {
                    name: 'Mood',
                    value: data.mood,
                    inline: true
                }, {
                    name: 'Color',
                    value: data.color,
                    inline: true
                }, {
                    name: 'Lucky number',
                    value: data.lucky_number,
                    inline: true
                }, {
                    name: 'Lucky time',
                    value: parseLuckyTime(data.lucky_time),
                    inline: true
                }, {
                    name: 'Date',
                    value: data.current_date,
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

export default getHoroscope;
