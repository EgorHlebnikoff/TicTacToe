import * as React from "react";
import Cookies from "../../modules/cookie/Cookie";
import {fetchGamesList, fetchJoinGameAction} from "../../modules/fetch/FetchModule";
import {IGetGamesListResponse, IJoinGameResponse} from "../../modules/fetch/FetchModuleTypes";
import {ButtonContainer, TransparentButton, TransparentLinkButton} from "../button/Button";
import GameCard from '../gameCard/GameCard';
import {GameState, IPlayer, PlayerState} from "../gameCard/GameCardTypes";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import Preloader from "../preloader/Preloader";
import Span from "../span/Span";
import {ConnectionStatus, IGameList, IGameListState, IGameParams, IPlayersParams} from "./GamesListTypes";
import StyledGameList, {PreloaderContainer} from './styles';

class GameList extends React.Component<IGameList, IGameListState> {
    private static getGamePlayers(playersParams: IPlayersParams): IPlayer[] {
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
            isCanToTryToConnect: true,
        };

        this.fetchGames();

        this.getGame = this.getGame.bind(this);
        this.fetchGames = this.fetchGames.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.redirectToGameHandler = this.redirectToGameHandler.bind(this);
        this.modalInputChangeHandler = this.modalInputChangeHandler.bind(this);
        this.setFocusToModalInput = this.setFocusToModalInput.bind(this);
    }

    public render(): JSX.Element {
        const emptyListSpan: JSX.Element = <Span classList='center white'>Список игр пуст</Span>;

        return (
            <section key="gamesList" className={this.props.className}>
                {this.state.games.length === 0 ? emptyListSpan : this.state.games}
                {this.state.isModalOpen && this.renderModal()}
            </section>
        );
    }

    private renderModal(): JSX.Element {
        const {isModalOpen}: IGameListState = this.state;

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
                {this.renderModalContent()}
            </Modal>
        );
    }

    private renderModalContent(): JSX.Element {
        const {isAllowedToContinue}: IGameListState = this.state;

        return (
            <React.Fragment>
                {!isAllowedToContinue && this.renderPreloader()}
                <Span classList='center'>{this.getSpanContent()}</Span>
                {!isAllowedToContinue && this.getModalInput()}
                <ButtonContainer>
                    {this.getButtons(isAllowedToContinue)}
                </ButtonContainer>
            </React.Fragment>
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

    private getButtons(isAllowedToContinue: boolean): JSX.Element {
        const {isCanToTryToConnect, currentGameToken}: IGameListState = this.state;

        const linkButtonHref: string = `${isAllowedToContinue ? `/game/${currentGameToken}` : '#'}`;
        const linkButtonClassList: string = `${!isAllowedToContinue ? 'joinGame' : ''} ` +
            `${isCanToTryToConnect ? 'continue' : ''}`;

        return (
            <React.Fragment>
                <TransparentButton onClick={this.closeModal}>Нет</TransparentButton>
                <TransparentLinkButton
                    onClick={this.redirectToGameHandler}
                    href={linkButtonHref}
                    disabled={!isCanToTryToConnect}
                    className={linkButtonClassList}
                >
                    Да
                </TransparentLinkButton>
            </React.Fragment>
        );
    }

    private openModal(gameToken: string, state: string): void {
        if (this.state.isModalOpen) return;

        const isAlreadyInGame: () => boolean = (): boolean => {
            if (!Cookies.doesExist('games')) return false;
            const currGameCookies = Cookies.get('games')[gameToken];

            return (currGameCookies as boolean)
                && (currGameCookies.type === 'owner' || currGameCookies.type === 'opponent');
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

    private async redirectToGameHandler(event: MouseEvent): Promise<void> {
        const eventTarget: HTMLLinkElement = event.target as HTMLLinkElement;
        if (!eventTarget.classList.contains('joinGame')) return;

        event.preventDefault();

        const {userName, gameToken, error} = this.getJoinGameParams();
        if (error) return;

        if (!this.openPreloader()) return;

        try {
            const {
                status,
                code,
                message,
                accessToken,
            }: IJoinGameResponse = await fetchJoinGameAction(userName, gameToken);
            if (status === 'error') return this.handleRequestError(code, message);

            this.handleJoinGameResponse(userName, gameToken, accessToken);
        } catch (error) {
            console.error('Error:', error);

            this.handleRequestError(500);
        }
    }

    private handleJoinGameResponse(userName: string, gameToken: string, accessToken: string) {
        this.setState({isConnected: true});

        Cookies.setGameCookies(gameToken, accessToken, 'opponent');
        Cookies.setNameCookies(userName);

        setTimeout(() => window.location.href = `/game/${gameToken}`, 1000);
    }

    private openPreloader(): boolean {
        if (!this.preloaderContainerRef) return false;

        const preloaderContainer: HTMLDivElement = this.preloaderContainerRef.current;
        preloaderContainer.classList.add('opened');

        return true;
    }

    private getJoinGameParams(): { userName: string; gameToken: string; error: boolean } {
        const userName: string | false = this.getUserName();
        if (!userName) return {userName: '', gameToken: '', error: true};

        const gameToken: string | false = this.getUserProvidedGameToken();
        if (!gameToken) return {userName: '', gameToken: '', error: true};

        return {userName, gameToken, error: false};
    }

    private triggerUserNameInputError(userNameInput: HTMLInputElement): false {
        this.closeModal();

        userNameInput.classList.add('error');
        userNameInput.focus();

        return false;
    }

    private getUserName(): string | false {
        const userNameInput: HTMLInputElement = this.props.userNameInputRef.current;
        if (!userNameInput) return false;

        if (userNameInput.value === '') this.triggerUserNameInputError(userNameInput);

        return userNameInput.value;
    }

    private triggerGameTokenInputError(gameTokenInput: HTMLInputElement): false {
        gameTokenInput.value = '';
        gameTokenInput.classList.add('error');
        gameTokenInput.focus();

        this.setState({
            connectionToGameStatus: ConnectionStatus.WRONG_TOKEN,
            isCanToTryToConnect: false,
        });

        return false;
    }

    private getUserProvidedGameToken(): string | false {
        if (!this.modalInputRef.current === null) return false;

        const gameTokenInput: HTMLInputElement = this.modalInputRef.current;
        if (gameTokenInput.value !== this.state.currentGameToken)
            return this.triggerGameTokenInputError(gameTokenInput);

        return gameTokenInput.value;
    }

    private getGame(currArray: JSX.Element[], currGame: IGameParams): JSX.Element[] {
        const id: string = currGame.gameToken;
        const time: number = currGame.gameDuration;
        const players: IPlayer[] = GameList.getGamePlayers(currGame);
        const state: GameState = GameList.getGameState(currGame);

        currArray.push(
            <GameCard key={id} token={id} players={players} time={time} state={state} clickFunc={this.openModal}/>,
        );

        return currArray;
    }

    private async fetchGames(): Promise<void> {
        try {
            const {status, code, message, games}: IGetGamesListResponse = await fetchGamesList();
            if (status === 'error') return this.handleRequestError(code, message);

            this.setState({games: games.reduce(this.getGame, [])});

            setTimeout(this.fetchGames, 5000);
        } catch (error) {
            this.handleRequestError(500, error.message);
        }
    }

    private handleRequestError(code: number, message: string = ''): void {
        console.error('Error: ', message);

        this.closeModal();
        if (code === 404) this.props.gameWasRemovedAlert('Шаг не может быть совершен, игра была прервана');
        if (code === 500) this.props.serverInternalErrorAlert();
    }
}

export default StyledGameList(GameList);
