const showHelp = (message, args) => {
    let response = '';

    if (args[1]) {
        switch (args[1]) {
            case 'user_no_zodiac_known':
                response = 'I don\'t know who you are. Please register using `.horoscope register` or provide a zodiac-sign like `.horoscope pisces`';
                break;

            case 'unknown_option_register':
                response = 'Unknown option';
                break;

            default:
                response = `Unknown command: \`${args[1]}\`.\n\nGlobal help`;
                break;
        }
    } else {
        response = 'Global help';
    }

    message.channel.send(response);
}

export default showHelp;
