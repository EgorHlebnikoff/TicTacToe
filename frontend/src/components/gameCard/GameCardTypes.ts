enum PlayerState {WON = "WON", LOST = "LOST", DRAW = "DRAW"}

enum GameState {WAITING = "WAITING", PLAYING = "PLAYING", ENDED = "ENDED"}

interface IPlayer {
    name: string;
    state?: PlayerState;
}

interface IGameCard {
    players: IPlayer[];
    state: GameState;
    time: number;
    token: string;
    className?: string;
    clickFunc: (gameToken: string, state: string) => void;
}

export {PlayerState, GameState, IPlayer, IGameCard};
