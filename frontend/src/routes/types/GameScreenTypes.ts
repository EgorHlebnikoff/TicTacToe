import {RouteComponentProps} from "react-router";

enum GameState {WAITING, PLAYING, WON, DRAW}

enum UserType {OWNER = 'owner', OPPONENT = 'opponent', VIEWER = 'viewer'}

interface IMatchParams {
    gameToken: string;
}

type IGameScreenProps = RouteComponentProps<IMatchParams>;

interface IGameScreenState {
    time: number;
    field: string[];
    players: {
        owner: string;
        opponent: string;
    };
    youTurn: boolean;
    winner?: string;
    gameState: GameState;
    isAlertModalOpen: boolean;
    alertMessage: string;
    callback?: () => Promise<void>;
}

export {GameState, UserType, IMatchParams, IGameScreenProps, IGameScreenState};
