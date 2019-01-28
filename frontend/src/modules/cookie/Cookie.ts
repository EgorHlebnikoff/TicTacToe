import Cookies from "universal-cookie";

class Cookie extends Cookies {
    constructor() {
        super();
    }

    public doesExist(name: string): boolean {
        // Получаем нужные куки и приводим значение к булевому типу
        return this.get(name) as boolean;
    }

    public setGameCookies(gameToken: string, accessToken: string, type: string): void {
        // Получаем куки игр, если они отсутствуют - то содаем их
        let gameCookies = this.get('games');
        if (!gameCookies) gameCookies = {};

        // Определяем знак пользователя, и добавляем в куки информацию о пользователе в текущей игре
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
