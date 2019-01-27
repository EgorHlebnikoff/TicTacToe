import * as express from 'express';
import {FindOneOptions, getRepository, Repository} from 'typeorm';
import {IRoute} from '../app/AppTypes';
import {Game, GameResult, GameState} from '../entity/Game';
import getError from '../service/ErrorHandler';
import checkGameState from '../utils/Checker';
import subtractDates from '../utils/DatesWorker';
import {randomAlphanumericString} from "../utils/Random";
import {IGameParams, IMakeStepParams, IRequestParams, ISortedGames} from "./ControllersTypes";

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

    private static getSurrenderData(gameDuration: number, nowTimestamp: Date, requesterType: string) {
        return {
            whomTurn: 'none',
            gameDuration,
            lastActivityTime: nowTimestamp,
            gameResult: requesterType === 'owner' ? GameResult.OPPONENT : GameResult.OWNER,
            state: GameState.DONE,
        };
    }

    private static getSetStartData(opponentName: string, opponentToken: string, currTime: Date) {
        return {
            opponent: opponentName,
            opponentAccessToken: opponentToken,
            state: GameState.PLAYING,
            lastActivityTime: currTime,
            timeOfStart: currTime,
            whomTurn: 'owner',
        };
    }

    private static getGameResult(gameState: string, who?: string): GameResult {
        if (gameState === 'playing') return GameResult.NO_RESULT;
        if (gameState === 'draw') return GameResult.DRAW;

        if (who === 'owner') return GameResult.OWNER;

        return GameResult.OPPONENT;
    }

    private static makeStep(field: string[], {row, column, who}: IMakeStepParams): string[] {
        return field.map((currRow: string, rowNum: number): string => {
            if (rowNum !== row) return currRow;

            return currRow.split('').map((currCol: string, colNum: number): string => {
                if (colNum !== column) return currCol;

                return who === 'owner' ? 'X' : 'O';
            }).join('');
        });
    }

    private static getWinnerName(game: Game): string {
        const gameResult = game.gameResult;
        if (gameResult === GameResult.NO_RESULT) return '';
        if (gameResult === GameResult.DRAW) return 'draw';
        if (gameResult === GameResult.OWNER) return game.owner;

        return game.opponent;
    }

    public routes: IRoute[];

    private currParams: IRequestParams;
    private accessToken: string;
    private readonly MAX_INACTIVITY_TIME: number = 300000;

    constructor() {
        this.routes = [
            {
                callback: this.createGame.bind(this),
                path: '/games/new',
                method: 'post',
            },
            {
                callback: this.getListOfGames.bind(this),
                path: '/games/list',
                method: 'get',
            },
            {
                callback: this.joinGame.bind(this),
                path: '/games/join',
                method: 'post',
            },
            {
                callback: this.getGameData.bind(this),
                path: '/games/get',
                method: 'get',
            },
            {
                callback: this.getGameStatus.bind(this),
                path: '/games/state',
                method: 'get',
            },
            {
                callback: this.handleSurrender.bind(this),
                path: '/games/surrender',
                method: 'post',
            },
            {
                callback: this.doStep.bind(this),
                path: '/games/do_step',
                method: 'post',
            },
        ];

        this.sortGames = this.sortGames.bind(this);
    }

    private getAccessToken(req: express.Request): void {
        this.accessToken = req.header("Access-Token");
    }

    private getParams(req: express.Request, ...params: string[]): void {
        this.currParams = {...req.body, error: false};

        for (const parameter of params) {
            if (this.currParams[parameter] || this.currParams[parameter] === 0) continue;

            this.currParams.error = true;
            this.currParams.message = `${parameter} parameter wasn't provided`;

            return;
        }

        return;
    }

    private getAccessTokenCriteria(): FindOneOptions {
        return {
            where: [
                {ownerAccessToken: this.accessToken},
                {opponentAccessToken: this.accessToken},
            ],
        };
    }

    private getRequesterType(game: Game): string {
        return game.ownerAccessToken === this.accessToken ? 'owner' : 'opponent';
    }

    private sortGames(currObj: ISortedGames, currGame: Game): ISortedGames {
        const gameParams: IGameParams = {
            gameToken: currGame.gameToken,
            owner: currGame.owner,
            opponent: currGame.opponent,
            size: currGame.size,
            gameDuration: currGame.gameDuration,
            gameResult: currGame.gameResult,
            state: currGame.state,
        };

        if (currGame.state === GameState.DONE) {
            currObj.correctGames.doneState.push(gameParams);

            return currObj;
        }

        const deltaTime: number = subtractDates(currObj.currTimestamp, currGame.lastActivityTime);
        if (deltaTime <= this.MAX_INACTIVITY_TIME) {
            if (currGame.state === GameState.READY) currObj.correctGames.waitingState.push(gameParams);
            if (currGame.state === GameState.PLAYING) currObj.correctGames.playingState.push(gameParams);
        }
        if (deltaTime >= this.MAX_INACTIVITY_TIME * 2) currObj.gamesToRemove.push(currGame);

        return currObj;
    }

    private async doStep(req: express.Request, res: express.Response) {
        this.getAccessToken(req);
        if (!this.accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        this.getParams(req, 'row', 'column');

        const {row, column, error, message}: IRequestParams = this.currParams;
        if (error) return res.json(getError(message));

        const repository: Repository<Game> = getRepository(Game);
        const nowTimestamp: Date = new Date();

        let game: Game;
        try {
            game = await repository.findOne(this.getAccessTokenCriteria());
        } catch (error) {
            return res.json(getError('Game was not found', 404));
        }

        const who: string = this.getRequesterType(game);
        const gameDuration: number = subtractDates(nowTimestamp, game.timeOfStart);
        const field: string[] = GamesController.makeStep(game.field, {row, column, who});
        const gameState = checkGameState(field);
        const state: GameState = gameState === 'playing' ? GameState.PLAYING : GameState.DONE;
        const gameResult: GameResult = GamesController.getGameResult(gameState, who);

        const updateParams = {
            whomTurn: who === 'owner' ? 'opponent' : 'owner',
            gameDuration,
            field,
            lastActivityTime: nowTimestamp,
            state,
            gameResult,
        };

        try {
            await repository.update({gameToken: game.gameToken}, updateParams);

            res.json({
                status: 'ok',
                code: 0,
            });
        } catch (error) {
            res.json(getError(error, 500));
        }
    }

    private async handleSurrender(req: express.Request, res: express.Response) {
        this.getAccessToken(req);
        if (!this.accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        const repository: Repository<Game> = getRepository(Game);
        const nowTimestamp: Date = new Date();

        let game: Game;
        try {
            game = await repository.findOne(this.getAccessTokenCriteria());
        } catch (error) {
            return res.json(getError(error, 404));
        }

        const who: string = this.getRequesterType(game);
        const gameDuration: number = subtractDates(nowTimestamp, game.timeOfStart);

        try {
            await repository.update(
                {gameToken: game.gameToken},
                GamesController.getSurrenderData(gameDuration, nowTimestamp, who),
            );

            res.json({
                status: 'ok',
                code: 0,
            });
        } catch (error) {
            res.json(getError(error, 500));
        }
    }

    private async getGameStatus(req: express.Request, res: express.Response) {
        this.getAccessToken(req);
        if (!this.accessToken) return res.json(getError("Access-Token header wasn't provided", 403));

        const repository: Repository<Game> = getRepository(Game);

        let game: Game;
        try {
            game = await repository.findOne(this.getAccessTokenCriteria());
        } catch (error) {
            return res.json(getError(error, 404));
        }

        const gameDuration: number = subtractDates(new Date(), game.timeOfStart);
        if (gameDuration > this.MAX_INACTIVITY_TIME) {
            await repository.remove(game);

            return res.json(getError('Game has been removed due to inactivity', 404));
        }

        try {
            await repository.update({gameToken: game.gameToken}, {gameDuration});

            const youTurn: boolean = game.whomTurn === this.getRequesterType(game);
            const winner: string = GamesController.getWinnerName(game);

            res.json({
                status: 'ok',
                code: 0,
                youTurn,
                gameDuration,
                field: game.field,
                winner,
            });
        } catch (error) {
            res.json(getError(error, 500));
        }
    }

    private async getGameData(req: express.Request, res: express.Response) {
        const {gameToken}: { gameToken: string } = req.query;
        if (!gameToken) return res.json(getError("gameToken parameter wasn't provided"));

        const repository: Repository<Game> = getRepository(Game);

        let game: Game;
        try {
            game = await repository.findOne({gameToken});
        } catch (error) {
            return res.json(getError(error, 404));
        }

        const {state, gameResult, lastActivityTime, gameDuration, field, owner, opponent} = game;
        const inactivityTime = subtractDates(new Date(), lastActivityTime);
        if (inactivityTime > this.MAX_INACTIVITY_TIME && state !== GameState.DONE) {
            await repository.remove(game);

            return res.json(getError('Game has been removed due to inactivity', 404));
        }

        res.json({
            status: 'ok',
            code: 0,
            state,
            gameResult,
            gameDuration,
            field,
            owner,
            opponent,
        });
    }

    private async createGame(req: express.Request, res: express.Response) {
        this.getParams(req, 'userName', 'size');

        const {userName, size, error, message}: IRequestParams = this.currParams;
        if (error) return res.json(getError(message));

        const repository: Repository<Game> = getRepository(Game);
        const newGame: Game = new Game();
        GamesController.setNewGameParams(newGame, {userName, size});

        try {
            await repository.insert(newGame);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            res.json({
                status: 'ok',
                code: 0,
                accessToken: newGame.ownerAccessToken,
                gameToken: newGame.gameToken,
            });
        } catch (error) {
            res.json(getError(error, 500));
        }
    }

    private async joinGame(req: express.Request, res: express.Response) {
        this.getParams(req, 'userName', 'gameToken');

        const {userName, gameToken, error, message}: IRequestParams = this.currParams;
        if (error) return res.json(getError(message));

        const repository: Repository<Game> = getRepository(Game);

        let game: Game;
        try {
            game = await repository.findOne({gameToken});
        } catch (error) {
            return res.json(getError(error, 404));
        }

        if (game.state === GameState.PLAYING) return res.json(getError("Game is already started", 403));
        if (game.opponent !== '') return res.json(getError("Game is already have a opponent", 403));

        const currTime: Date = new Date();
        const accessToken: string = randomAlphanumericString(12);

        try {
            await repository.update(
                {gameToken},
                GamesController.getSetStartData(userName, accessToken, currTime),
            );
        } catch (error) {
            return res.json(getError(error, 500));
        }

        res.json({
            status: 'ok',
            code: 0,
            accessToken,
        });
    }

    private async getListOfGames(req: express.Request, res: express.Response) {
        const repository: Repository<Game> = getRepository(Game);

        let gameObjects: Game[] = [];
        const currTimestamp: Date = new Date();

        try {
            gameObjects = await repository.find({order: {id: 'DESC'}});
        } catch (error) {
            return res.json(getError(error, 500));
        }

        const initialSortedGamesObj: ISortedGames = {
            correctGames: {
                waitingState: [],
                playingState: [],
                doneState: [],
            },
            gamesToRemove: [],
            currTimestamp,
        };
        const {correctGames, gamesToRemove} = gameObjects.reduce(this.sortGames, initialSortedGamesObj);

        if (gamesToRemove.length !== 0) await repository.remove(gamesToRemove);

        res.json({
            status: 'ok',
            code: 0,
            games: [...correctGames.waitingState, ...correctGames.playingState, ...correctGames.doneState],
        });
    }
}

export default new GamesController();
