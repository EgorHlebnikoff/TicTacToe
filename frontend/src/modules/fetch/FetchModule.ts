import {
    ICreateGameResponse,
    IErrorResponse,
    IGameDataResponse,
    IGameStatusResponse,
    IGetGamesListResponse,
    IJoinGameResponse,
} from "./FetchModuleTypes";

async function fetchGameData(gameToken: string): Promise<IGameDataResponse> {
    try {
        const response = await fetch(`/games/get?gameToken=${gameToken}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await response.json();
    } catch (error) {
        throw new Error(`Cannot fetch data from '/games/get?gameToken=${gameToken}'`);
    }
}

async function fetchGameStatus(accessToken: string): Promise<IGameStatusResponse> {
    try {
        const response = await fetch('/games/state', {
            headers: {
                "Content-Type": "application/json",
                "Access-Token": accessToken,
            },
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/state'");
    }
}

async function fetchSurrenderAction(accessToken: string): Promise<IErrorResponse> {
    try {
        const response = await fetch('/games/surrender', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Token": accessToken,
            },
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/surrender'");
    }
}

async function fetchDoStepAction([row, column]: number[], accessToken: string): Promise<IErrorResponse> {
    try {
        const response = await fetch('/games/do_step', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Token": accessToken,
            },
            body: JSON.stringify({row, column}),
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/do_step'");
    }
}

async function fetchNewGameAction(userName: string): Promise<ICreateGameResponse> {
    try {
        const response = await fetch('/games/new', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userName,
                size: 3,
            }),
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/new'");
    }
}

async function fetchGamesList(): Promise<IGetGamesListResponse> {
    try {
        const response = await fetch('/games/list', {
            headers: {'Content-Type': "application/json"},
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/list'");
    }
}

async function fetchJoinGameAction(userName: string, gameToken: string): Promise<IJoinGameResponse> {
    try {
        const response = await fetch('/games/join', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userName, gameToken}),
        });

        return await response.json();
    } catch (error) {
        throw new Error("Cannot fetch data from '/games/join'");
    }
}

export {
    fetchGameStatus,
    fetchGameData,
    fetchSurrenderAction,
    fetchDoStepAction,
    fetchNewGameAction,
    fetchGamesList,
    fetchJoinGameAction,
};
