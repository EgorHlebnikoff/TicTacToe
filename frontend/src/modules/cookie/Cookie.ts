import Cookies from "universal-cookie";

class Cookie extends Cookies {
    constructor() {
        super();
    }

    public doesExist(name: string): boolean {
        return this.get(name) as boolean;
    }

    public setGameCookies(gameToken: string, accessToken: string): void {
        let gameCookies = this.get('games');
        if (!gameCookies) gameCookies = {};

        gameCookies[gameToken] = {
            accessToken,
            type: 'owner',
        };
        this.set('games', gameCookies, {path: '/'});
    }

    public setNameCookies(userName: string): void {
        this.set('userName', userName, {path: '/'});
    }
}

export default new Cookie();
