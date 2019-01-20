import * as React from "react";
import getTime from "../../modules/date/DateModule";
import Span from "../span/Span";
import * as styled from './styles';

export enum PlayerState {WON = "WON", LOST = "LOST", DRAW = "DRAW"}

export enum GameState {WAITING = "WAITING", PLAYING = "PLAYING", ENDED = "ENDED"}

export interface IPlayer {
    name: string;
    state?: PlayerState;
}

export interface IGameCard {
    players: IPlayer[];
    state: GameState;
    time: number;
    className?: string;
    onClick?: () => void;
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
            <div className={this.props.className} onClick={this.props.onClick}>
                <styled.PlayersContainer>
                    {this.getPlayers()}
                </styled.PlayersContainer>
                <div>
                    {this.getGameStatus()}
                </div>
                <styled.TimeSpan>{getTime(this.props.time)}</styled.TimeSpan>
            </div>
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
}

export default styled.GameCard(GameCard);
