import path from 'path';
import {
    createCanvas,
    loadImage
} from 'canvas';

import bodies from './util/bodies';
import zodiacs from './util/zodiacs';

const getCanvasChart = async horoscope => {
    const horoscopeSorted = horoscope._celestialBodies.all
        .sort((a, b) => a.Sign.zodiacStart - b.Sign.zodiacStart)
        .sort((a, b) => a.House.id - b.House.id)
        .map(body => ({
            zodiac: body.Sign.label,
            zodiac_icon: zodiacs[body.Sign.key].text,
            body: body.label,
            body_icon: String.fromCodePoint(bodies[body.key].unicode),
            house: body.House.id
        }));

    const plutoIcon = await loadImage(path.resolve(__dirname, './assets/pluto.svg'));
    const chironIcon = await loadImage(path.resolve(__dirname, './assets/chiron.svg'));

    const canvas = createCanvas(520, 720);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#36393f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Table
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(10, 80, canvas.width - 20, canvas.height - 90);

    // Vertical line 1
    ctx.beginPath();
    ctx.moveTo(200, 80);
    ctx.lineTo(200, canvas.height - 10);
    ctx.stroke();

    // Vertical line 2
    ctx.beginPath();
    ctx.moveTo(380, 80);
    ctx.lineTo(380, canvas.height - 10);
    ctx.stroke();

    // Ascendant
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Your ascendant is ${String.fromCodePoint(0x2191)} ${horoscope._ascendant.Sign.label}`, canvas.width / 2, 50);

    const offsetTop = 120;
    const offsetRow = 50;

    let prevZodiac = null;
    let prevHouse = null;
    horoscopeSorted.forEach((entry, idx) => {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';

        // Zodiacs
        if (prevZodiac !== entry.zodiac) {
            if (prevZodiac !== null) {
                ctx.beginPath();
                ctx.moveTo(10, 85 + (offsetRow * idx));
                ctx.lineTo(200, 85 + (offsetRow * idx));
                ctx.stroke();
            }

            ctx.fillText(entry.zodiac_icon, 20, offsetTop + (offsetRow * idx));
            ctx.fillText(entry.zodiac, 50, offsetTop + (offsetRow * idx));
            prevZodiac = entry.zodiac;
        }

        // Bodies
        if (entry.body === 'Pluto') { // Fuck you, Pluto, you shit dwarfstar you
            ctx.drawImage(plutoIcon, 217, offsetTop + (offsetRow * idx) - 20, 24, 24);
        } else if (entry.body === 'Chiron') {
            ctx.drawImage(chironIcon, 215, offsetTop + (offsetRow * idx) - 20, 24, 24);
        } else {
            ctx.textAlign = 'center';
            ctx.fillText(entry.body_icon, 230, offsetTop + (offsetRow * idx));
        }
        ctx.textAlign = 'left';
        ctx.fillText(entry.body, 250, offsetTop + (offsetRow * idx));

        // Houses
        if (prevHouse !== entry.house) {
            if (prevHouse !== null) {
                ctx.beginPath();
                ctx.moveTo(380, 85 + (offsetRow * idx));
                ctx.lineTo(canvas.width - 10, 85 + (offsetRow * idx));
                ctx.stroke();
            }

            ctx.fillText(entry.house, 400, offsetTop + (offsetRow * idx));
            prevHouse = entry.house;
        }
    });

    return canvas;
};

export default getCanvasChart;
