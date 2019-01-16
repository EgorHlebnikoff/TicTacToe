import * as React from "react";
import Span from "../span/Span";
import * as styled from './styles';

export enum PlayerState {WON = "WON", LOST = "LOST", DRAW = "DRAW"}

export enum GameState {WAITING = "WAITING", PLAYING = "PLAYING", ENDED = "ENDED"}

interface IDate {
    hours: string;
    minutes: string;
    seconds: string;
}

export interface IPlayer {
    name: string;
    state?: PlayerState;
}

export interface IGameCard {
    players: IPlayer[];
    state: GameState;
    time: number;
    className?: string;
}

class GameCard extends React.Component<IGameCard, {}> {
    private static getPlayer(currArray: JSX.Element[], currPlayer: IPlayer, index: number): JSX.Element[] {
        const {name, state}: IPlayer = currPlayer;

        currArray.push((
            <styled.Player key={index} color={state}>
                {name !== '' ? name : 'Ожидается...'}
            </styled.Player>
        ));

        return currArray;
    }

    public render(): JSX.Element {
        return (
            <a className={this.props.className}>
                <styled.PlayersContainer>
                    {this.getPlayers()}
                </styled.PlayersContainer>
                <div>
                    {this.getGameStatus()}
                </div>
                {this.getTime()}
            </a>
        );
    }

    private getPlayers(): JSX.Element[] {
        return this.props.players.reduce(GameCard.getPlayer, []);
    }

    private getGameStatus(): JSX.Element {
        const getStatus: (currState: GameState) => string = (currState: GameState) => {
            if (currState === GameState.ENDED) return 'Игра завершена';
            if (currState === GameState.PLAYING) return 'Игра не завершена';
            if (currState === GameState.WAITING) return 'Игрок ожидает оппонента';
        };

        const state: GameState = this.props.state;

        return <Span>{getStatus(state)}</Span>;
    }

    private getTimeFromMilliseconds(): IDate {
        const milliseconds: number = this.props.time;

        const seconds: string = (milliseconds / 1000).toFixed(0);
        const minutes: string = (milliseconds / (1000 * 60)).toFixed(0);
        const hours: string = (milliseconds / (1000 * 60 * 60)).toFixed(0);

        return {
            hours: hours.length === 1 ? '0' + hours : hours,
            minutes: minutes.length === 1 ? '0' + minutes : minutes,
            seconds: seconds.length === 1 ? '0' + seconds : seconds,
        };
    }

    private getTime(): JSX.Element {
        const date: IDate = this.getTimeFromMilliseconds();

        return <styled.TimeSpan>{`${date.hours}:${date.minutes}:${date.seconds}`}</styled.TimeSpan>;
    }
}

export default styled.GameCard(GameCard);
