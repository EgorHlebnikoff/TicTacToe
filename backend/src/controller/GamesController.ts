import {getRepository, Repository} from 'typeorm';
import {IRoute} from '../app/App';
import {Game, GameResult, GameState} from '../entity/Game';
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

    private static checkRows(field: string[]): boolean {
        return field.some((currRow: string) => currRow === 'XXX' || currRow === 'OOO');
    }

    private static checkColumns(field: string[]): boolean {
        return [0, 1, 2].some(
            (colNum: number): boolean => {
                const isWonByX = field.every(
                    (currRow: string): boolean => currRow.split('')[colNum] === 'X',
                );

                const isWonByO = field.every(
                    (currRow: string): boolean => currRow.split('')[colNum] === 'O',
                );

                return isWonByX || isWonByO;
            },
        );
    }

    private static checkDiagonals(field: string[], indexes: number[]): boolean {
        const isWonByX = field.every((currRow: string, rowNum: number): boolean => {
            return currRow.split('')[indexes[rowNum]] === 'X';
        });

        const isWonByO = field.every((currRow: string, rowNum: number): boolean => {
            return currRow.split('')[indexes[rowNum]] === 'O';
        });

        return isWonByX || isWonByO;
    }

    private static isWon(field: string[]): boolean {
        return this.checkRows(field)
            || this.checkColumns(field)
            || this.checkDiagonals(field, [0, 1, 2])
            || this.checkDiagonals(field, [2, 1, 0]);
    }

    private static isDraw(field: string[]): boolean {
        return field.every((currRow: string): boolean => {
            return currRow.split('').every((currCol: string): boolean => currCol !== '?');
        });
    }

    private static checkGameState(field: string[]): string {
        if (this.isWon(field)) return 'won';
        if (this.isDraw(field)) return 'draw';

        return 'playing';
    }

    public createGameRoute: IRoute;
    public gamesListRoute: IRoute;
    public joinGameRoute: IRoute;
    public getGameDataRoute: IRoute;
    public getGameStatusRoute: IRoute;
    public handlerSurrenderRoute: IRoute;
    public doStepRoute: IRoute;

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

        this.getGameDataRoute = {
            callback: this.getGameData.bind(this),
            path: '/games/get',
            method: 'get',
        };

        this.getGameStatusRoute = {
            callback: this.getGameStatus.bind(this),
            path: '/games/state',
            method: 'get',
        };

        this.handlerSurrenderRoute = {
            callback: this.handleSurrender.bind(this),
            path: '/games/surrender',
            method: 'post',
        };

        this.doStepRoute = {
            callback: this.doStep.bind(this),
            path: '/games/do_step',
            method: 'post',
        };
    }

    private async doStep(req: any, res: any) {
        const accessToken = req.header("Access-Token");
        if (!accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        const {row, column} = req.body;
        if (!row && row !== 0) return res.json(getError("row parameter wasn't provided"));
        if (!column && column !== 0) return res.json(getError("column parameter wasn't provided"));

        const repository: Repository<Game> = getRepository(Game);
        const nowTimestamp: Date = new Date();

        try {
            const game = await repository.findOne({
                where: [
                    {ownerAccessToken: accessToken},
                    {opponentAccessToken: accessToken},
                ],
            });

            const who: string = game.ownerAccessToken === accessToken ? 'owner' : 'opponent';
            const gameDuration: number = nowTimestamp.getTime() - game.timeOfStart.getTime();
            const field = game.field.map((currRow: string, rowNum: number): string => {
                if (rowNum !== row) return currRow;

                return currRow.split('').map((currCol: string, colNum: number): string => {
                    if (colNum !== column) return currCol;

                    return who === 'owner' ? 'X' : 'O';
                }).join('');
            });

            const gameState = GamesController.checkGameState(field);
            const state: GameState = gameState === 'playing' ? GameState.PLAYING : GameState.DONE;
            const gameResult: GameResult = gameState === ''
                ? GameResult.NO_RESULT
                : gameState === 'draw'
                    ? GameResult.DRAW
                    : who === 'owner'
                        ? GameResult.OWNER
                        : GameResult.OPPONENT;

            const updateParams = {
                whomTurn: who === 'owner' ? 'opponent' : 'owner',
                gameDuration,
                field,
                lastActivityTime: nowTimestamp,
                state,
                gameResult,
            };

            await repository.update({gameToken: game.gameToken}, updateParams);

            res.json({
                status: 'ok',
                code: 0,
            });
        } catch (error) {
            res.json(getError("Game not found", 404));
        }
    }

    private async handleSurrender(req: any, res: any) {
        const accessToken = req.header("Access-Token");
        if (!accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        const repository: Repository<Game> = getRepository(Game);
        const nowTimestamp: Date = new Date();

        try {
            const game = await repository.findOne({
                where: [
                    {ownerAccessToken: accessToken},
                    {opponentAccessToken: accessToken},
                ],
            });

            const who: string = game.ownerAccessToken === accessToken ? 'owner' : 'opponent';
            const gameDuration: number = nowTimestamp.getTime() - game.timeOfStart.getTime();

            const updateParams = {
                whomTurn: 'none',
                gameDuration,
                lastActivityTime: nowTimestamp,
                gameResult: who === 'owner' ? GameResult.OPPONENT : GameResult.OWNER,
                state: GameState.DONE,
            };

            await repository.update({gameToken: game.gameToken}, updateParams);

            res.json({
                status: 'ok',
                code: 0,
            });
        } catch (error) {
            res.json(getError("Game not found", 404));
        }
    }

    private async getGameStatus(req: any, res: any) {
        const getWinnerName: (game: Game) => string = (game: Game): string => {
            const gameResult = game.gameResult;
            if (gameResult === GameResult.DRAW || gameResult === GameResult.NO_RESULT) return '';
            if (gameResult === GameResult.OWNER) return game.owner;

            return game.opponent;
        };

        const accessToken = req.header("Access-Token");
        if (!accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        const repository: Repository<Game> = getRepository(Game);
        const nowTimestamp = new Date().getTime();

        try {
            const game = await repository.findOne({
                where: [
                    {ownerAccessToken: accessToken},
                    {opponentAccessToken: accessToken},
                ],
            });

            const who: string = game.ownerAccessToken === accessToken ? 'owner' : 'opponent';
            const youTurn: boolean = game.whomTurn === who;
            const gameDuration: number = nowTimestamp - game.timeOfStart.getTime();
            const field: string[] = game.field;
            const winner: string = getWinnerName(game);

            if (gameDuration > this.MAX_INACTIVITY_TIME) {
                await repository.remove(game);

                return res.json(getError('Game has been removed due to inactivity', 404));
            }

            await repository.update({gameToken: game.gameToken}, {gameDuration});

            res.json({
                status: 'ok',
                code: 0,
                youTurn,
                gameDuration,
                field,
                winner,
            });
        } catch (error) {
            res.json(getError("Game not found", 404));
        }
    }

    private async getGameData(req: any, res: any) {
        const {gameToken} = req.query;
        if (!gameToken) return res.json(getError("gameToken parameter wasn't provided"));

        const repository: Repository<Game> = getRepository(Game);

        try {
            const game = await repository.findOne({gameToken});

            if (game.gameDuration > this.MAX_INACTIVITY_TIME) {
                await repository.remove(game);

                return res.json(getError('Game has been removed due to inactivity', 404));
            }

            res.json({
                status: 'ok',
                code: 0,
                state: game.state,
                gameResult: game.gameResult,
                gameDuration: game.gameDuration,
                field: game.field,
                owner: game.owner,
                opponent: game.opponent,
            });
        } catch (error) {
            res.json(getError("Game not found", 404));
        }
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

            const currTime: Date = new Date();
            const accessToken: string = randomAlphanumericString(12);
            const updatedData = {
                opponent: userName,
                opponentAccessToken: accessToken,
                state: GameState.PLAYING,
                lastActivityTime: currTime,
                timeOfStart: currTime,
                whomTurn: 'owner',
            };

            await repository.update({gameToken}, updatedData);

            res.json({
                status: 'ok',
                code: 0,
                accessToken,
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
