import * as React from 'react';
import {RouteComponentProps} from "react-router";
import Cookies from "universal-cookie";
import GlobalStyle from '../globalStyles';
import Container from "./container/Container";
import GameField from "./gameField/GameField";
import Header from './header/Header';
import PlayerBar from './playerBar/PlayerBar';

export enum GameState {WAITING, PLAYER_TURN, OPPONENT_TURN, WON, DRAW}

export enum UserType {OWNER, OPPONENT, VIEWER}

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
    winner?: string;
    gameState: GameState;
}

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
    private readonly gameToken: string = this.props.match.params.gameToken;

    private timeIncreaseInterval: WindowTimers | null = null;
    private currPlayerStatus: UserType;
    private currPlayerAccessToken: string | null = null;

    constructor(props: IGameScreenProps) {
        super(props);

        this.setPlayerInfo();
        this.fetchGameData();

        // this.state = {
        //     time: 0,
        //     field: [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']],
        //     players: {
        //         owner: 'Андрей Хайнекен',
        //         opponent: "Борис Гиннес",
        //     },
        // };

        this.handleTurn = this.handleTurn.bind(this);
        this.increaseTime = this.increaseTime.bind(this);
    }

    public componentWillMount(): void {
        this.timeIncreaseInterval = setInterval(this.increaseTime, 1000);
    }

    public render(): JSX.Element[] {
        const gameFieldProps = {
            field: this.state.field,
            time: this.state.time,
            turnHandler: this.handleTurn,
        };

        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
            (
                <Container key={'container'}>
                    <PlayerBar players={this.state.players}/>
                    <GameField {...gameFieldProps}/>
                </Container>
            ),
        ]);
    }

    private setPlayerInfo(): void {
        const gameCookies = new Cookies().get('games');
        if (!gameCookies || !gameCookies[this.gameToken]) {
            this.currPlayerStatus = UserType.VIEWER;

            return;
        }

        const {type, accessToken} = gameCookies[this.gameToken];

        this.currPlayerStatus = type === 'owner'
            ? UserType.OWNER
            : UserType.OPPONENT;

        this.currPlayerAccessToken = accessToken;
    }

    private increaseTime(): void {
        const time = this.state.time + 1000;
        this.setState({time});
    }

    private handleTurn([row, column]: number[]) {
        const newField = this.state.field;
        newField[row].split('')[column] = 'X';

        this.setState({field: newField});
    }

    private fetchGameData() {
        fetch('/games/get', {
            headers: {"Content-Type": "application/json"},
        })
            .then((response) => response.json())
            .then((response) => {
                const {status, code, owner, opponent, gameResult, state, gameDuration, field} = response;
                if (status !== 'ok' && code !== 0) return;

                let gameState: GameState;
                let winner: string;

                if (gameResult !== '') {
                    if (gameResult === 'draw') {
                        gameState = GameState.DRAW;
                    } else {
                        gameState = GameState.WON;
                        winner = gameResult === 'owner' ? owner : opponent;
                    }
                }

                if (state === 'ready') {
                    gameState = GameState.WAITING;

                    setTimeout(this.fetchGameData, 2000);
                }
                // if (state === 'playing') this.fetchGameStatus(); - получить параметры игры, прямо сейчас.

                const stateObject = {
                    time: gameDuration,
                    players: {
                        owner,
                        opponent,
                    },
                    field,
                    gameState,
                    winner,
                };

                this.setState({...stateObject});

                return;
            })
            .catch((error) => console.error('Error: ', error));
    }
}
