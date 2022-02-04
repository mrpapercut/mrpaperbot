const dbSchema = {
    name: 'Mrpaperbot_horoscope',
    index: 'userid',
    fields: {
        userid: 'text',
        zodiac: 'text',
        dob_year: 'int',
        dob_month: 'int',
        dob_day: 'int',
        dob_hour: 'int',
        dob_minute: 'int',
        pob_lat: 'float',
        pob_long: 'float'
    }
};

export default dbSchema;
