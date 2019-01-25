import {Game} from "../entity/Game";

export interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

export interface ISortedGames {
    correctGames: IGameParams[];
    gamesToRemove: Game[];
    currTimestamp: Date;
}

export interface IMakeStepParams {
    row: number;
    column: number;
    who: string;
}

export interface IRequestParams {
    userName?: string;
    size?: number;
    gameToken?: string;
    error: boolean;
    message?: string;
    row?: number;
    column?: number;
}
