const showHelp = (message, args) => {
    let response = '';
    let helpKey = null;
    
    if (typeof args === 'string') {
        helpKey = args;
    } else if (args[1]) {
        helpKey = args[1];
    }

    if (helpKey) {
        switch (helpKey) {
            case 'user_no_zodiac_known':
                response = 'I don\'t know who you are. Please register using `.horoscope register` or provide a zodiac-sign like `.horoscope pisces`';
                break;

            case 'unknown_option_register':
                response = 'Unknown option';
                break;

            default:
                response = `Unknown command: \`${helpKey}\`.\n\nGlobal help`;
                break;
        }
    } else {
        response = 'Global help';
    }

    message.channel.send(response);
}

export default showHelp;
