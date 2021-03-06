import * as React from "react";
import getTime from "../../modules/date/DateModule";
import Span from "../span/Span";
import {GameState, IGameCard, IPlayer} from "./GameCardTypes";
import * as styled from './styles';

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

    constructor(props: IGameCard) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className} onClick={this.handleClick}>
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

    private handleClick(): void {
        this.props.clickFunc(this.props.token, GameState[this.props.state]);
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
