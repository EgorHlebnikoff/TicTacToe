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

interface ICorrectGames {
    waitingState: IGameParams[];
    playingState: IGameParams[];
    doneState: IGameParams[];
}

interface ISortedGames {
    correctGames: ICorrectGames;
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
