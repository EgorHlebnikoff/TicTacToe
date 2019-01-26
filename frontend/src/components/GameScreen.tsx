import * as React from 'react';
import {RouteComponentProps} from "react-router";
import Cookies from "universal-cookie";
import GlobalStyle from '../globalStyles';
import {fetchGameData, fetchGameStatus, fetchSurrenderAction} from "../modules/fetch/FetchModule";
import Container from "./container/Container";
import GameField from "./gameField/GameField";
import Header from './header/Header';
import PlayerBar from './playerBar/PlayerBar';

export enum GameState {WAITING, PLAYING, WON, DRAW}

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
    youTurn: boolean;
    winner?: string;
    gameState: GameState;
}

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
    private readonly gameToken: string = this.props.match.params.gameToken;

    private timeIncreaseInterval: any = null;
    private fetchGameDataTimeout: any = null;
    private fetchGameStatusTimeout: any = null;
    private currPlayerStatus: UserType;
    private currPlayerAccessToken: string | null = null;

    constructor(props: IGameScreenProps) {
        super(props);

        this.setPlayerInfo();

        this.state = {
            field: ['???', '???', '???'],
            time: 0,
            gameState: GameState.WAITING,
            players: {
                owner: 'LOADING',
                opponent: 'LOADING',
            },
            youTurn: false,
        };

        this.fetchGameData();

        this.handleTurn = this.handleTurn.bind(this);
        this.handleSurrender = this.handleSurrender.bind(this);
        this.increaseTime = this.increaseTime.bind(this);
        this.fetchGameData = this.fetchGameData.bind(this);
        this.fetchGameStatus = this.fetchGameStatus.bind(this);
    }

    public render(): JSX.Element[] {
        const gameFieldProps = {
            field: this.state.field,
            time: this.state.time,
            turnHandler: this.handleTurn,
            surrenderHandler: this.handleSurrender,
            gameState: this.state.gameState,
            winner: this.state.winner,
            youTurn: this.state.youTurn,
            userType: this.currPlayerStatus,
            players: this.state.players,
        };

        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
            (
                <Container key={'container'}>
                    <PlayerBar playerType={this.currPlayerStatus} players={this.state.players}/>
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
        this.setState({time: this.state.time});
    }

    private handleTurn([row, column]: number[]) {
        fetch('/games/do_step', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Token": this.currPlayerAccessToken,
            },
            body: JSON.stringify({row, column}),
        })
            .then((response) => response.json())
            .then((response) => {
                const {status, code} = response;
                if (status !== 'ok' || code !== 0) return;

                const newField = this.state.field;
                newField[row].split('')[column] = this.currPlayerStatus === UserType.OWNER ? 'X' : 'O';

                this.setState({
                    field: newField,
                    youTurn: false,
                });
            })
            .catch((error) => console.error('Error: ', error));
    }

    private async handleSurrender() {
        try {
            const {status, code} = await fetchSurrenderAction(this.currPlayerAccessToken);

            if (status !== 'ok' || code !== 0) return;
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    private async fetchGameData() {
        let data;
        try {
            data = await fetchGameData(this.gameToken);
        } catch (error) {
            console.error('Error: ', error);
        }

        const {status, code, state} = data;
        if (status !== 'ok' && code !== 0) return;

        if (state === 'done') return this.gameDoneStateHandler({...data});
        if (state === 'ready') return this.gameReadyStateHandler({...data});
        if (state === 'playing') return this.gamePlayingStateHandler({...data});
    }

    private gameDoneStateHandler({owner, opponent, gameResult, gameDuration, field}: {
        owner: string,
        opponent: string,
        gameResult: string,
        gameDuration: number,
        field: string[],
    }) {
        let gameState: GameState;
        let winner: string;

        if (gameResult === 'draw') {
            gameState = GameState.DRAW;
        } else {
            gameState = GameState.WON;
            winner = gameResult === 'owner' ? owner : opponent;
        }

        this.setState({
            time: gameDuration,
            players: {
                owner,
                opponent,
            },
            field,
            gameState,
            winner,
        });
    }

    private gameReadyStateHandler({owner, opponent, gameDuration, field}: {
        owner: string,
        opponent: string,
        gameDuration: number,
        field: string[],
    }) {
        this.setState({
            time: gameDuration,
            players: {
                owner,
                opponent,
            },
            field,
            gameState: GameState.WAITING,
        });

        this.fetchGameDataTimeout = setTimeout(this.fetchGameData, 2000);
    }

    private gamePlayingStateHandler({owner, opponent, gameDuration, field}: {
        owner: string,
        opponent: string,
        gameDuration: number,
        field: string[],
    }) {
        this.setState({
            time: gameDuration,
            players: {
                owner,
                opponent,
            },
            field,
            gameState: GameState.PLAYING,
        });

        this.currPlayerStatus !== UserType.VIEWER
            ? this.fetchGameStatus()
            : setTimeout(this.fetchGameData, 2000);
    }

    private async fetchGameStatus() {
        this.timeIncreaseInterval = setInterval(this.increaseTime, 1000);

        let data;
        try {
            data = await fetchGameStatus(this.currPlayerAccessToken);
            this.handleFetchedGameStatusData(data);
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    private handleFetchedGameStatusData({...data}): void {
        const {status, code, youTurn, gameDuration, field, winner} = data;
        if (status !== 'ok' || code !== 0) return;

        const gameState = winner && winner !== ''
            ? winner === 'draw'
                ? GameState.DRAW
                : GameState.WON
            : this.state.gameState;

        this.setState({youTurn, time: gameDuration, field, winner, gameState});

        if (gameState === GameState.PLAYING)
            this.fetchGameStatusTimeout = setTimeout(this.fetchGameStatus, 2000);
    }
}
