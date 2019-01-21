import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Container from "./container/Container";
import GameField from "./gameField/GameField";
import Header from './header/Header';
import PlayerBar from './playerBar/PlayerBar';

interface IGameScreenState {
    time: number;
    field: string[];
    players: {
        owner: string;
        opponent: string;
    };
}

export default class GameScreen extends React.Component<{}, IGameScreenState> {
    private timeIncreaseInterval: WindowTimers | null = null;

    constructor(props: {}) {
        super(props);

        this.state = {
            time: 0,
            field: ['?', '?', '?', '?', '?', '?', '?', '?', '?'],
            players: {
                owner: 'Андрей Хайнекен',
                opponent: "Борис Гиннес",
            },
        };

        this.handleTurn = this.handleTurn.bind(this);
        this.increaseTime = this.increaseTime.bind(this);
    }

    public componentWillMount(): void {
        this.timeIncreaseInterval = setInterval(this.increaseTime, 1000);
    }

    public render(): JSX.Element[] {
        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
            (
                <Container key={'container'}>
                    <PlayerBar players={this.state.players}/>
                    <GameField field={this.state.field} time={this.state.time} turnHandler={this.handleTurn}/>
                </Container>
            ),
        ]);
    }

    private increaseTime(): void {
        this.setState({time: this.state.time + 1000});
    }

    private handleTurn(index: number) {
        const newField = this.state.field;
        newField[index] = 'X';

        this.setState({field: newField});
    }
}
