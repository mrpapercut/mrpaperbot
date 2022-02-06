import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';
import { Message, MessageEmbedOptions } from 'discord.js';

import BotModule from '../BotModule';

type GameInfo = {
    title: string,
    url: string,
    image: string,
    times: {
        main: string,
        mainp: string,
        completionist: string,
    }
};

class HLTBModule extends BotModule {
    constructor() {
        super();

        this.commandConfig = Object.assign({}, this.defaultCommandConfig, {
            name: 'How Long To Beat',
            aliases: ['hltb']
        });
    }

    public async handleMessage(message: Message, args?: string) {
        const [gametitle, platform] = this.matchTitlePlatform(args);
        const html = await this.request(gametitle, platform);
        const gameinfo = this.processHTML(html);

        if (gameinfo.title === '') {
            message.channel.send(`Game not found: ${args}`);
        } else {
            const embedConfig = this.getEmbed(gameinfo);
            message.channel.send({embeds: embedConfig});
        }
    }

    private matchTitlePlatform(args) {
        const platforms = {
            'NES': ['nes', 'nintendo'],
            'Super Nintendo': ['supernintendo', 'snes'],
            'Nintendo 64': ['nintendo64', 'n64'],
            'Nintendo GameCube': ['nintendogamecube', 'gamecube', 'ngc', 'gcn'],
            'Wii': ['nintendowii', 'wii'],
            'Wii U': ['nintendowiiu', 'wiiu'],
            'Nintendo Switch': ['nintendoswitch', 'switch'],
            'Game Boy': ['nintendogameboy', 'nintendogb', 'gameboy', 'gb'],
            'Game Boy Advance': ['nintendogameboyadvance', 'nintendogba', 'gameboyadvance', 'gba'],
            'Game Boy Color': ['nintendogameboycolor', 'nintendogbc', 'gameboycolor', 'gbc'],
            'Nintendo DS': ['nintendods', 'ds'],
            'Nintendo 3DS': ['nintendo3ds', '3ds'],
            'Playstation': ['sonyplaystation', 'playstation', 'playstation1', 'ps1', 'psx'],
            'Playstation 2': ['sonyplaystation2', 'playstation2', 'ps2'],
            'Playstation 3': ['sonyplaystation3', 'playstation3', 'ps3'],
            'Playstation 4': ['sonyplaystation4', 'playstation4', 'ps4'],
            'Playstation 5': ['sonyplaystation5', 'playstation5', 'ps5'],
            'Playstation Portable': ['sonyplaystationportable', 'sonypsp', 'playstationportable', 'psp'],
            'Playstation Vita': ['sonyplaystationvita', 'sonyvita', 'sonypsvita', 'playstationvita', 'psv', 'psvita', 'vita'],
            'Playstation VR': ['sonyplaystationvr', 'playstationvr', 'psvr', 'sonypsvr'],
            'Sega Master System': ['segamastersystem', 'mastersystem', 'sms', 'ms'],
            'Sega Mega Drive/Genesis': ['segamegadrive', 'megadrive', 'segamd', 'segagenesis', 'genesis'],
            'Sega Saturn': ['segasaturn', 'saturn'],
            'Dreamcast': ['segadreamcast', 'dreamcast'],
            'Xbox': ['microsoftxbox', 'xbox', 'ogxbox'],
            'Xbox 360': ['microsoftxbox360', 'xbox360', 'x360'],
            'Xbox One': ['microsoftxboxone', 'xboxone', 'xbo', 'xbone'],
            'Xbox Series X/S': ['microsoftxboxx', 'microsoftxboxs', 'microsoftxboxseriesx', 'microsoftxboxseriess', 'microsoftxsx', 'xboxseriesx', 'xboxseriess', 'microsoftxbx', 'xsx'],
            'PC': ['pc', 'windows'],
            'PC VR': ['pcvr', 'vr']
        }

        const argsSplit = args.split(' ');
        const lastWord = argsSplit.pop().toLowerCase();
        let platform = '';

        for (const p in platforms) {
            if (platforms[p].includes(lastWord)) {
                platform = p;
                break;
            }
        }

        if (platform !== '') {
            const gametitle = argsSplit.join(' ');

            return [gametitle, platform];
        } else {
            return [args, platform];
        }
    }

    private async request(game: string, platform: string) {
        const url = `https://howlongtobeat.com/search_results?page=1`;
        const payload = new URLSearchParams();
        payload.append('queryString', game);
        payload.append('t', 'games');
        payload.append('sorthead', 'popular');
        payload.append('sortd', '0');
        payload.append('plat', platform);
        payload.append('length_type', 'mainp');
        payload.append('length_min', '');
        payload.append('length_max', '');
        payload.append('v', '');
        payload.append('f', '');
        payload.append('g', '');
        payload.append('detail', '');
        payload.append('randomize', '0');

        const res = await fetch(url, {
            method: 'post',
            body: payload,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36'
            }
        });

        return await res.text();
    }

    private processHTML(html: string) {
        const dom = JSDOM.fragment(`<div>${html}</div>`);

        const firstHit = dom.querySelector('li');

        const response: GameInfo = {
            title: '',
            url: '',
            image: '',
            times: {
                main: '',
                mainp: '',
                completionist: ''
            }
        }

        try {
            response.title = firstHit.querySelector('a[class^=text_]').innerHTML;
            response.url = firstHit.querySelector('a[class^=text_]').href;
            response.image = firstHit.querySelector('img').src;

            const times = [...firstHit.querySelectorAll('div.search_list_details_block div > div')];
            const mappedTimes = {
                main: times[1].innerHTML,
                mainp: times[3].innerHTML,
                completionist: times[5].innerHTML,
            }

            response.times = mappedTimes;
        } catch (e) {
            console.error(e);
            console.log(firstHit.outerHTML);
        }

        return response;
    }

    private getEmbed(gameinfo: GameInfo) {
        const embedConfig: Array<MessageEmbedOptions> = [{
            title: gameinfo.title,
            description: `How long to beat ${gameinfo.title}?`,
            url: `https://howlongtobeat.com/${gameinfo.url}`,
            thumbnail: {
                url: `https://howlongtobeat.com${gameinfo.image}`
            },
            fields: [{
                name: 'Main:',
                value: gameinfo.times.main
            }, {
                name: 'Main + Extras:',
                value: gameinfo.times.mainp
            }, {
                name: 'Completionist:',
                value: gameinfo.times.completionist
            }]
        }];

        return embedConfig;
    }
}

export default HLTBModule;
