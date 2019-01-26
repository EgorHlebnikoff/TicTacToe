import * as React from "react";

enum ConnectionStatus {INITIAL = "INITIAL", ERROR = "ERROR", WRONG_TOKEN = "WRONG_TOKEN"}

interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

interface IGameListState {
    games: JSX.Element[];
    isModalOpen: boolean;
    currentGameToken: string;
    currentGameState: string;
    connectionToGameStatus: ConnectionStatus;
    isConnected: boolean;
    isAllowedToContinue: boolean;
    isCanToTryToConnect: boolean;
}

interface IGameList {
    userNameInputRef: React.RefObject<HTMLInputElement>;
    serverInternalErrorAlert: () => void;
    gameWasRemovedAlert: (message: string) => void;
    className?: string;
}

interface IPlayersParams {
    owner: string;
    opponent: string;
    gameResult: string;
}

export {IGameParams, IGameList, IGameListState, IPlayersParams, ConnectionStatus};
