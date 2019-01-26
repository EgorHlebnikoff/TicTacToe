async function fetchGameData(gameToken: string) {
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

async function fetchGameStatus(accessToken: string) {
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

async function fetchSurrenderAction(accessToken: string) {
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

export {fetchGameStatus, fetchGameData, fetchSurrenderAction};
