import {Game} from "../entity/Game";

interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

interface ISortedGames {
    correctGames: IGameParams[];
    gamesToRemove: Game[];
    currTimestamp: Date;
}

interface IMakeStepParams {
    row: number;
    column: number;
    who: string;
}

interface IRequestParams {
    userName?: string;
    size?: number;
    gameToken?: string;
    error: boolean;
    message?: string;
    row?: number;
    column?: number;
}

export {IRequestParams, IGameParams, IMakeStepParams, ISortedGames};
