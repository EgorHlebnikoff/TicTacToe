import Cookies from "universal-cookie";

class Cookie extends Cookies {
    constructor() {
        super();
    }

    public doesExist(name: string): boolean {
        return this.get(name) as boolean;
    }

    public setGameCookies(gameToken: string, accessToken: string, type: string): void {
        let gameCookies = this.get('games');
        if (!gameCookies) gameCookies = {};

        const mark = type === 'owner' ? 'X' : type === 'opponent' ? 'O' : '?';

        gameCookies[gameToken] = {
            accessToken,
            type,
            mark,
        };
        this.set('games', gameCookies, {path: '/'});
    }

    public setNameCookies(userName: string): void {
        this.set('userName', userName, {path: '/'});
    }
}

export default new Cookie();
