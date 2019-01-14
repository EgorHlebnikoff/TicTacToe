import * as React from "react";
import GameCard, {GameState, IPlayer, PlayerState} from '../gameCard/GameCard';
import StyledGameList from './styles';

interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

interface IGameList {
    className?: string;
}

const games: IGameParams[] = [
    {
        gameToken: '123123',
        owner: 'A',
        opponent: '',
        size: 3,
        gameDuration: 12312,
        gameResult: '',
        state: 'ready',
    },
    {
        gameToken: '1231as',
        owner: 'A',
        opponent: 'B',
        size: 3,
        gameDuration: 12312,
        gameResult: '',
        state: 'playing',
    },
    {
        gameToken: '1231ad',
        owner: 'A',
        opponent: 'B',
        size: 3,
        gameDuration: 12312,
        gameResult: 'owner',
        state: 'done',
    },
    {
        gameToken: '1231a4',
        owner: 'A',
        opponent: 'B',
        size: 3,
        gameDuration: 12312,
        gameResult: 'opponent',
        state: 'done',
    },
    {
        gameToken: '1231a8',
        owner: 'A',
        opponent: 'B',
        size: 3,
        gameDuration: 12312,
        gameResult: 'draw',
        state: 'done',
    },
];

class GameList extends React.Component<IGameList, {}> {
    private static getGamePlayers({owner, opponent, gameResult}: { owner, opponent, gameResult: string }): IPlayer[] {
        const players: IPlayer[] = [];

        const firstPlayer: IPlayer = {
            name: owner,
        };
        if (gameResult === 'owner') firstPlayer.state = PlayerState.WON;
        if (gameResult === 'opponent') firstPlayer.state = PlayerState.LOST;

        players.push(firstPlayer);

        if (opponent === '') return players;

        const secondPlayer: IPlayer = {
            name: opponent,
        };
        if (gameResult === 'opponent') secondPlayer.state = PlayerState.WON;
        if (gameResult === 'owner') secondPlayer.state = PlayerState.LOST;

        players.push(secondPlayer);

        return players;
    }

    private static getGameState({state}: { state: string }): GameState {
        if (state === 'ready') return GameState.WAITING;
        if (state === 'playing') return GameState.PLAYING;

        return GameState.ENDED;
    }

    private static getGame(currArray: JSX.Element[], currGame: IGameParams): JSX.Element[] {
        const id = currGame.gameToken;
        const time = currGame.gameDuration;
        const players: IPlayer[] = GameList.getGamePlayers(currGame);
        const state = GameList.getGameState(currGame);

        currArray.push((
            <GameCard key={id} players={players} time={time} state={state}/>
        ));

        return currArray;
    }

    public render(): JSX.Element {
        return (
            <section className={this.props.className}>
                {this.getCards()}
            </section>
        );
    }

    private getCards(): JSX.Element[] {
        return games.reduce(GameList.getGame, []);
    }
}

export default StyledGameList(GameList);
