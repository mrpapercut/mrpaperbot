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

    // console.log(`Ascendant: ${horoscope._ascendant.Sign.label}`);
    // console.log(`Sun sign: ${horoscope._celestialBodies.sun.Sign.label}`);
    // console.log(`Moon sign: ${horoscope._celestialBodies.moon.Sign.label}`);

    const plutoIcon = await loadImage(path.resolve(__dirname, './assets/pluto.svg'));

    const canvas = createCanvas(480, 640);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#36393f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Table
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    // Vertical line 1
    ctx.beginPath();
    ctx.moveTo(200, 10);
    ctx.lineTo(200, canvas.height - 10);
    ctx.stroke();
    // Vertical line 2
    ctx.beginPath();
    ctx.moveTo(380, 10);
    ctx.lineTo(380, canvas.height - 10);
    ctx.stroke();

    const offsetTop = 50;
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
                ctx.moveTo(10, 15 + (offsetRow * idx));
                ctx.lineTo(200, 15 + (offsetRow * idx));
                ctx.stroke();
            }

            ctx.fillText(entry.zodiac_icon, 20, offsetTop + (offsetRow * idx));
            ctx.fillText(entry.zodiac, 50, offsetTop + (offsetRow * idx));
            prevZodiac = entry.zodiac;
        }

        // Bodies
        if (entry.body === 'Pluto') { // Fuck you, Pluto, you dwarfstar you
            ctx.drawImage(plutoIcon, 217, offsetTop + (offsetRow * idx) - 20, 24, 24);
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
                ctx.moveTo(380, 15 + (offsetRow * idx));
                ctx.lineTo(canvas.width - 10, 15 + (offsetRow * idx));
                ctx.stroke();
            }

            ctx.fillText(entry.house, 400, offsetTop + (offsetRow * idx));
            prevHouse = entry.house;
        }
    });

    return canvas;
};

export default getCanvasChart;
