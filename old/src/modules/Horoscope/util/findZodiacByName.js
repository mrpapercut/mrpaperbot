import zodiacs from './zodiacs';

const findZodiacByName = term => {
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

export default findZodiacByName;
