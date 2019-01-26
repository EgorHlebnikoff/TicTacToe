import {GameState, UserType} from "../../routes/types/GameScreenTypes";

interface IPlayers {
    owner: string;
    opponent: string;
}

interface IGameField {
    gameState: GameState;
    players: IPlayers;
    field: string[];
    winner?: string;
    time: number;
    youTurn: boolean;
    userType: UserType;
    surrenderHandler?: () => void;
    turnHandler: ([row, column]: number[]) => void;
}

export {GameState, UserType, IPlayers, IGameField};
