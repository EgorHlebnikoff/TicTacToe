import {getRepository, Repository} from 'typeorm';
import {IRoute} from '../app/App';
import {Game, GameState} from '../entity/Game';
import getError from '../service/ErrorHandler';
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
    private static setNewGameParams(newGame: Game, {userName, size}: { userName: string, size: number }) {
        newGame.owner = userName;
        newGame.size = size;
        newGame.ownerAccessToken = randomAlphanumericString(12);
        newGame.gameToken = randomAlphanumericString(6);
        newGame.timeOfCreation = new Date();
        newGame.lastActivityTime = new Date();
        newGame.field = ['???', '???', '???'];
    }

    public createGameRoute: IRoute;
    public gamesListRoute: IRoute;
    public joinGameRoute: IRoute;

    private readonly MAX_INACTIVITY_TIME: number = 300000;

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

        this.joinGameRoute = {
            callback: this.joinGame.bind(this),
            path: '/games/join',
            method: 'post',
        };
    }

    private async createGame(req: any, res: any) {
        const {userName, size} = req.body;
        if (!userName) return res.json(getError("userName parameter wasn't provided"));
        if (!size) return res.json(getError("size parameter wasn't provided"));

        const repository: Repository<Game> = getRepository(Game);
        const newGame = new Game();
        GamesController.setNewGameParams(newGame, {userName, size});

        try {
            await repository.insert(newGame);

            res.json({
                status: 'ok',
                code: 0,
                accessToken: newGame.ownerAccessToken,
                gameToken: newGame.gameToken,
            });
        } catch (error) {
            console.log(error);
        }
    }

    private async joinGame(req: any, res: any) {
        const {userName, gameToken} = req.body;
        if (!userName) return req.json(getError("userName parameter wasn't provided"));
        if (!gameToken) return req.json(getError("gameToken parameter wasn't provided"));

        const repository: Repository<Game> = getRepository(Game);

        try {
            const game: Game = await repository.findOne({gameToken});

            if (game.state === GameState.PLAYING) return req.json(getError("Game is already started"), 403);
            if (game.opponent !== '') return req.json(getError("Game is already have a opponent"), 403);

            const updatedData = {
                opponent: userName,
                opponentAccessToken: randomAlphanumericString(12),
                state: GameState.PLAYING,
                lastActivityTime: new Date(),
            };

            await repository.update({gameToken}, updatedData);

            res.json({
                status: 'ok',
                code: 0,
                accessToken: game.opponentAccessToken,
            });
        } catch (error) {
            console.log(error);
        }
    }

    private async getListOfGames(req: any, res: any) {
        const repository: Repository<Game> = getRepository(Game);

        const games: IGameParams[] = [];
        const toRemoveArr: Game[] = [];
        const currTimestamp = new Date().getTime();

        try {
            const gameObjects: Game[] = await repository.find();

            gameObjects.forEach((currGame: Game): void => {
                const deltaTime: number = currTimestamp - currGame.lastActivityTime.getTime();

                if (deltaTime <= this.MAX_INACTIVITY_TIME)
                    games.push({...currGame});
                else
                    toRemoveArr.push(currGame);
            });

            if (toRemoveArr.length !== 0) await repository.remove(toRemoveArr);

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
