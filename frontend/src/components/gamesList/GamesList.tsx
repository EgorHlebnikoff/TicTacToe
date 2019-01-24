import * as React from "react";
import Cookies from "universal-cookie";
import {ButtonContainer, TransparentButton, TransparentLinkButton} from "../button/Button";
import GameCard, {GameState, IPlayer, PlayerState} from '../gameCard/GameCard';
import Input from "../input/Input";
import Modal from "../modal/Modal";
import Preloader from "../preloader/Preloader";
import Span from "../span/Span";
import StyledGameList, {PreloaderContainer} from './styles';

enum ConnectionStatus {INITIAL = "INITIAL", ERROR = "ERROR", WRONG_TOKEN = "WRONG_TOKEN"}

interface IGameParams {
    gameToken: string;
    owner: string;
    opponent: string;
    size: number;
    gameDuration: number;
    gameResult: string;
    state: string;
}

interface IGameListState {
    games: JSX.Element[];
    isModalOpen: boolean;
    currentGameToken: string;
    currentGameState: string;
    connectionToGameStatus: ConnectionStatus;
    isConnected: boolean;
    isAllowedToContinue: boolean;
    isCanToTryToConnect: boolean;
}

interface IGameList {
    userNameInputRef: React.RefObject<HTMLInputElement>;
    className?: string;
}

class GameList extends React.Component<IGameList, IGameListState> {
    private static getGamePlayers(playersParams: { owner: string; opponent: string; gameResult: string; }): IPlayer[] {
        const players: IPlayer[] = [];

        const firstPlayer: IPlayer = {
            name: playersParams.owner,
        };
        if (playersParams.gameResult === 'owner') firstPlayer.state = PlayerState.WON;
        if (playersParams.gameResult === 'draw') firstPlayer.state = PlayerState.DRAW;
        if (playersParams.gameResult === 'opponent') firstPlayer.state = PlayerState.LOST;
        players.push(firstPlayer);

        const secondPlayer: IPlayer = {
            name: playersParams.opponent,
        };
        if (playersParams.gameResult === 'opponent') secondPlayer.state = PlayerState.WON;
        if (playersParams.gameResult === 'draw') secondPlayer.state = PlayerState.DRAW;
        if (playersParams.gameResult === 'owner') secondPlayer.state = PlayerState.LOST;
        players.push(secondPlayer);

        return players;
    }

    private static getGameState({state}: { state: string }): GameState {
        if (state === 'ready') return GameState.WAITING;
        if (state === 'playing') return GameState.PLAYING;

        return GameState.ENDED;
    }

    private modalInputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    private preloaderContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props: IGameList) {
        super(props);

        this.state = {
            games: [],
            isModalOpen: false,
            currentGameToken: '',
            currentGameState: '',
            connectionToGameStatus: ConnectionStatus.INITIAL,
            isConnected: false,
            isAllowedToContinue: true,
            isCanToTryToConnect: false,
        };

        this.getGame = this.getGame.bind(this);
        this.fetchGames = this.fetchGames.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.redirectToGameHandler = this.redirectToGameHandler.bind(this);
        this.modalInputChangeHandler = this.modalInputChangeHandler.bind(this);
        this.setFocusToModalInput = this.setFocusToModalInput.bind(this);
    }

    public componentWillMount(): void {
        this.fetchGames();
    }

    public render(): JSX.Element {
        return (
            <section key="gamesList" className={this.props.className}>
                {this.state.games.length === 0 ? <Span>Список игр пуст</Span> : this.state.games}
                {this.state.isModalOpen && this.renderModal()}
            </section>
        );
    }

    private renderModal(): JSX.Element {
        const {
            isAllowedToContinue,
            currentGameToken,
            isModalOpen,
            isCanToTryToConnect,
        } = this.state;

        return (
            <Modal
                key='Modal'
                title='Подвердить'
                isOpen={isModalOpen}
                afterOpen={this.setFocusToModalInput}
                onClose={this.closeModal}
                closeByOutsideClick={true}
                closeByESC={true}
                className='verifyRedirectionModal'
            >
                {!isAllowedToContinue && this.renderPreloader()}
                <Span>{this.getSpanContent()}</Span>
                {!isAllowedToContinue && this.getModalInput()}
                <ButtonContainer>
                    <TransparentButton onClick={this.closeModal}>Нет</TransparentButton>
                    <TransparentLinkButton
                        href={`${isAllowedToContinue ? /game/ + currentGameToken : '#'}`}
                        onClick={this.redirectToGameHandler}
                        disabled={!isCanToTryToConnect}
                        className={`${!isAllowedToContinue ? 'joinGame' : ''} ${isCanToTryToConnect ? 'continue' : ''}`}
                    >
                        Да
                    </TransparentLinkButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private renderPreloader(): JSX.Element {
        return (
            <PreloaderContainer ref={this.preloaderContainerRef}>
                <Preloader isComplete={this.state.isConnected}/>
            </PreloaderContainer>
        );
    }

    private getSpanContent(): string {
        const gameStatus: string = this.state.currentGameState;
        const connectionStatus: string = this.state.connectionToGameStatus;

        if (gameStatus === GameState.ENDED) return 'Вы уверены, что хотите посмотреть результаты игры?';
        if (gameStatus === GameState.PLAYING) return 'Вы уверены, что хотите наблюдать за этой игрой?';
        if (this.state.isAllowedToContinue) return 'Вы уверены, что хотите перейти к игре?';

        if (connectionStatus === ConnectionStatus.INITIAL) return 'Для подключения к игре введите gameToken';
        if (connectionStatus === ConnectionStatus.WRONG_TOKEN) return 'Неверный gameToken';
        if (connectionStatus === ConnectionStatus.ERROR) return 'Возникла ошибка при подкючении';
    }

    private getModalInput(): JSX.Element {
        return <Input ref={this.modalInputRef} color="NORMAL" border='full' onChange={this.modalInputChangeHandler}/>;
    }

    private openModal(gameToken: string, state: string): void {
        if (this.state.isModalOpen) return;

        const isAlreadyInGame: () => boolean = (): boolean => {
            const cookies = new Cookies();
            const gameCookies = cookies.get('games');
            if (!gameCookies) return false;

            const currGameCookies = gameCookies[gameToken];
            return currGameCookies && (currGameCookies.type === 'owner' || gameCookies.type === 'opponent');
        };

        const isAllowedToContinue = isAlreadyInGame() || state !== 'WAITING';

        this.setState({
            isModalOpen: true,
            currentGameToken: gameToken,
            currentGameState: state,
            isAllowedToContinue,
            isCanToTryToConnect: isAllowedToContinue,
        });
    }

    private setFocusToModalInput(): void {
        if (this.modalInputRef.current === null) return;
        const input: HTMLInputElement = this.modalInputRef.current;

        input.focus();
    }

    private closeModal(): void {
        if (!this.state.isModalOpen) return;

        this.setState({
            isModalOpen: false,
            currentGameToken: '',
            currentGameState: '',
            isAllowedToContinue: true,
            connectionToGameStatus: ConnectionStatus.INITIAL,
        });
    }

    private modalInputChangeHandler(): void {
        if (!this.modalInputRef.current === null) return;
        const input: HTMLInputElement = this.modalInputRef.current;
        const isEmptyValue: boolean = input.value === '';

        if (input.classList.contains('error')) input.classList.remove('error');

        if (isEmptyValue && !this.state.isCanToTryToConnect) return;
        if (!isEmptyValue && this.state.isCanToTryToConnect) return;

        this.setState({isCanToTryToConnect: !isEmptyValue});
    }

    private redirectToGameHandler(e: MouseEvent): void {
        const eventTarget: HTMLLinkElement = e.target as HTMLLinkElement;
        if (!eventTarget.classList.contains('joinGame')) return;

        e.preventDefault();

        const userName: string | false = this.getUserName();
        if (!userName) return;

        const gameToken: string | false = this.getUserProvidedGameToken();
        if (!gameToken) return;

        if (!this.preloaderContainerRef) return;
        const preloaderContainer: HTMLDivElement = this.preloaderContainerRef.current;
        preloaderContainer.classList.add('opened');

        fetch('/games/join', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userName, gameToken}),
        })
            .then((response) => response.json())
            .then((response) => {
                const {status, code, accessToken} = response;
                if (status === 'ok' && code === 0) {
                    this.setState({isConnected: true});

                    const cookies = new Cookies();
                    let gameCookies = cookies.get('games');
                    if (!gameCookies) gameCookies = {};

                    gameCookies[gameToken] = {
                        accessToken,
                        type: 'opponent',
                    };
                    cookies.set('games', gameCookies, {path: '/'});

                    setTimeout(() => window.location.href = `/game/${gameToken}`, 1000);
                }
            })
            .catch((error: Error) => console.error('Error:', error));
    }

    private getUserName(): string | false {
        const userNameInput: HTMLInputElement = this.props.userNameInputRef.current;
        if (!userNameInput) return false;
        if (userNameInput.value !== '') return userNameInput.value;

        this.closeModal();

        userNameInput.classList.add('error');
        userNameInput.focus();

        return false;
    }

    private getUserProvidedGameToken(): string | false {
        if (!this.modalInputRef.current === null) return false;

        const gameTokenInput: HTMLInputElement = this.modalInputRef.current;
        if (gameTokenInput.value === this.state.currentGameToken) return gameTokenInput.value;

        gameTokenInput.value = '';
        gameTokenInput.classList.add('error');
        gameTokenInput.focus();
        this.setState({
            connectionToGameStatus: ConnectionStatus.WRONG_TOKEN,
            isCanToTryToConnect: false,
        });

        return false;
    }

    private getGame(currArray: JSX.Element[], currGame: IGameParams): JSX.Element[] {
        const id = currGame.gameToken;
        const time = currGame.gameDuration;
        const players: IPlayer[] = GameList.getGamePlayers(currGame);
        const state = GameList.getGameState(currGame);

        currArray.push((
            <GameCard key={id} token={id} players={players} time={time} state={state} clickFunc={this.openModal}/>
        ));

        return currArray;
    }

    private fetchGames() {
        fetch('/games/list', {
            headers: {'Content-Type': "application/json"},
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({games: response.games.reduce(this.getGame, [])});

                setTimeout(this.fetchGames, 5000);
            })
            .catch((error: Error) => console.error('Error:', error));
    }
}

export default StyledGameList(GameList);
