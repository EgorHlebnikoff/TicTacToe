import {getRepository, Repository} from 'typeorm';
import {IRoute} from '../app/App';
import {Game} from '../entity/Game';
import {randomAlphanumericString} from "../utils/Random";

interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

class GamesController {
    public createGameRoute: IRoute;
    public gamesListRoute: IRoute;

    constructor() {
        this.createGameRoute = {
            callback: this.createGame.bind(this),
            path: '/games/new',
            method: 'post',
        };

        this.gamesListRoute = {
            callback: this.getListOfGames.bind(this),
            path: '/games/list',
            method: 'get',
        };
    }

    private async createGame(req: any, res: any) {
        try {
            const repository: Repository<Game> = getRepository(Game);

            const newGame = new Game();
            newGame.owner = req.body.userName;
            newGame.size = req.body.size;

            const accessToken = randomAlphanumericString(12);
            const gameToken = randomAlphanumericString(6);
            newGame.ownerAccessToken = accessToken;
            newGame.gameToken = gameToken;

            await repository.save(newGame);

            res.json({
                status: 'ok',
                code: 0,
                accessToken,
                gameToken,
            });
        } catch (error) {
            console.log(error);
        }
    }

    private async getListOfGames(req: any, res: any) {
        try {
            const repository: Repository<Game> = getRepository(Game);

            const gameObjects: Game[] = await repository.find();
            const getGame: (currGame: Game) => IGameParams = (currGame: Game): IGameParams => {
                return {...currGame};
            };

            const games: IGameParams[] = gameObjects.map(getGame);

            res.json({
                status: 'ok',
                code: 0,
                games,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default new GamesController();
