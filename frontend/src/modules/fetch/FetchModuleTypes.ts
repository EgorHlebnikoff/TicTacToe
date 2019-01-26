import {IGameParams} from "../../components/gamesList/GamesListTypes";

interface IErrorResponse {
    status?: string;
    code?: number;
    message?: string;
}

interface IGameResponse extends IErrorResponse {
    field?: string[];
    gameDuration?: number;
}

interface IGameStatusResponse extends IGameResponse {
    youTurn?: boolean;
    winner?: string;
}

interface IGameDataResponse extends IGameResponse {
    owner?: string;
    opponent?: string;
    gameResult?: string;
    state?: string;
}

interface ICreateGameResponse extends IErrorResponse {
    gameToken: string;
    accessToken: string;
}

interface IGetGamesListResponse extends IErrorResponse {
    games: IGameParams[];
}

interface IJoinGameResponse extends IErrorResponse {
    accessToken: string;
}

export {
    IErrorResponse,
    IGameDataResponse,
    IGameResponse,
    IGameStatusResponse,
    ICreateGameResponse,
    IGetGamesListResponse,
    IJoinGameResponse,
};
