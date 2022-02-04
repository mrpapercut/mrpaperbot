import showHelp from './showHelp';

import findZodiacByName from './util/findZodiacByName';

import dbSchema from './dbSchema';
import DB from '../../util/DB';

const registerSign = async (message, zodiacsign) => {
    let validatedZodiac = findZodiacByName(zodiacsign);

    if (!zodiacsign || !validatedZodiac) {
        return showHelp(message, 'help_register_sign_arguments');
    } else {
        const db = new DB(dbSchema);
        await db.init();

        const res = await db.registerUser({
            userid: message.author.id,
            zodiac: validatedZodiac
        });

        const storedUser = await db.getByIndex(message.author.id);
        console.log(storedUser);
        
        if (res.existingUser) {
            message.channel.send('Successfully updated your zodiacsign');
        } else {
            message.channel.send('Successfully registered your zodiacsign');
        }

    }
}

const registerUser = async (message, args) => {
    // message.channel.send('registration coming soon');

    // args[0] = 'register'
    switch (args[1]) {
        case 'sign':
            await registerSign(message, args[2]);
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

export default registerUser;
