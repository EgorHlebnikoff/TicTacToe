import * as React from "react";
import * as styled from './styles';

export enum PlayerState {WON = "WON", LOST = "LOST"}

export enum GameState {WAITING = "WAITING", PLAYING = "PLAYING", ENDED = "ENDED"}

export interface IPlayer {
    name: string;
    state?: PlayerState;
}

export interface IGameCard {
    players: IPlayer[];
    state?: GameState;
    time: number;
    className?: string;
}

class GameCard extends React.Component<IGameCard, {}> {
    private static getPlayer(currArray: JSX.Element[], currPlayer: IPlayer): JSX.Element[] {
        const {name, state}: IPlayer = currPlayer;
        const color = () => state === 'WON' ? 'yellow' : 'black';

        currArray.push(<styled.Player key={name} color={color()}>{name}</styled.Player>);

        return currArray;
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className}>
                <div>
                    {this.getPlayers()}
                </div>
                {this.getTime()}
            </div>
        );
    }

    private getPlayers(): JSX.Element[] {
        return this.props.players.reduce(GameCard.getPlayer, []);
    }

    private getTime(): JSX.Element {
        const date: Date = new Date(this.props.time);

        return <styled.Span>{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</styled.Span>;
    }
}

export default styled.GameCard(GameCard);
