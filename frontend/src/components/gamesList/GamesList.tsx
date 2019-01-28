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
        return [
            this.getPlayer(playersParams.owner, playersParams.gameResult, 'owner'),
            this.getPlayer(playersParams.opponent, playersParams.gameResult, 'opponent'),
        ];
    }

    private static getPlayer(name: string, gameResult: string, type: string): IPlayer {
        const player: IPlayer = {
            name,
        };

        // Если gameResult равен пустой строке - возвращаем объект игрока
        // Иначе устанавливаем нужное состояние в зависимости от gameResult и типа игрока,
        // и затем возвращаем объект игрока
        if (gameResult === '') return player;

        if (gameResult === 'draw') player.state = PlayerState.DRAW;
        if (gameResult === type)
            player.state = PlayerState.WON;
        else
            player.state = PlayerState.LOST;

        return player;
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
            listOfGamesAnnotation: 'Список игр загружается...',
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
        const {listOfGamesAnnotation}: IGameListState = this.state;
        const isListOfGamesEmpty: boolean = this.state.games.length === 0;

        return (
            <section key="gamesList" className={`${this.props.className} ${isListOfGamesEmpty ? 'flex' : ''}`}>
                {isListOfGamesEmpty ? <Span className='center white'>{listOfGamesAnnotation}</Span> : this.state.games}
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

        // Если пользователю разрешено продолжить переход к игре - отрисовываем компонент с корректной ссылкой.
        // и делаем кнопку перехода активной для перехода, но не активной, для для попытки соединения.
        // Иначе отрисовываем с якорем наверх и активной кнопкой, для попытки перехода
        const linkButtonHref: string = `${isAllowedToContinue ? `/game/${currentGameToken}` : '#'}`;
        const linkButtonClassList: string = `${!isCanToTryToConnect ? 'joinGame' : ''} ` +
            `${isAllowedToContinue ? 'continue' : ''}`;

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
            // Если куки не существуют возвращем false
            if (!Cookies.doesExist('games')) return false;
            const currGameCookies = Cookies.get('games')[gameToken];

            // Проверяем тип пользователя, чтобы определить то, осуществлялся ли им вход в игру
            return (currGameCookies.type === 'owner' || currGameCookies.type === 'opponent');
        };

        // Если пользователь уе подключен к игре или состояние игры отличаетс от "Ожидание",
        // то разрешаем пользователю продолжить переход к игре
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

        // Если поле находится в сотоянии ошибки, то снимаем это состояние
        if (input.classList.contains('error')) input.classList.remove('error');

        // Если поле пустое и пользователю все еще нельзя пытаться подключиться
        // или поле не пустое, и пользователю уже уже можно пытаться подключиться
        // то не меняем сосояние
        if (isEmptyValue && !this.state.isCanToTryToConnect) return;
        if (!isEmptyValue && this.state.isCanToTryToConnect) return;

        this.setState({isCanToTryToConnect: !isEmptyValue});
    }

    private async redirectToGameHandler(event: MouseEvent): Promise<void> {
        const eventTarget: HTMLLinkElement = event.target as HTMLLinkElement;
        // Если пользователю не разрешено осуществлять попытку присоединения
        // - то возращаемся из функции и позволяем перейти в игру
        if (!eventTarget.classList.contains('joinGame')) return;

        event.preventDefault();

        // Получаем необходимые для перехода в игре параметры, возвращаемся из функции, если не удается
        const {userName, gameToken, error} = this.getJoinGameParams();
        if (error) return;

        // Возвращаемся из функции, если не удается открыть прелоадер
        if (!this.openPreloader()) return;

        // Делаем запрос для входа в игру на сервер, если все хорошо - обрабатываем полученные данные
        // иначе - обрабатываем ошибку
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

        // Устаналиваем куки игры и имени пользователя
        Cookies.setGameCookies(gameToken, accessToken, 'opponent');
        Cookies.setNameCookies(userName);

        // Редиректим пользователя в игру через 1 секунду
        setTimeout(() => window.location.href = `/game/${gameToken}`, 1000);
    }

    private openPreloader(): boolean {
        if (!this.preloaderContainerRef) return false;

        const preloaderContainer: HTMLDivElement = this.preloaderContainerRef.current;
        preloaderContainer.classList.add('opened');

        return true;
    }

    private getJoinGameParams(): { userName: string; gameToken: string; error: boolean } {
        // Поочередно пытаемся получить параметры, имя пользователя и gameToken,
        // если не удается - возвращаем пустой объект с ошибкой
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
        // Делаем запрос на сервер, для получения списка игр,
        // если все хорошо - получем элементы на основе полученных данных
        // и устанавливаем таймер на следущий оспрос сервера,
        // иначе обрабатываем ошибку
        try {
            const {status, code, message, games}: IGetGamesListResponse = await fetchGamesList();
            if (status === 'error') return this.handleRequestError(code, message);

            const gameCards: JSX.Element[] = games.reduce(this.getGame, []);

            this.setState({
                games: gameCards,
                listOfGamesAnnotation: gameCards.length === 0 ? 'Список игр пуст' : '',
            });

            setTimeout(this.fetchGames, 5000);
        } catch (error) {
            this.handleRequestError(500, error.message);
        }
    }

    private handleRequestError(code: number, message: string = ''): void {
        // Выводим сообщение об ошибке в консоль и открываем модальное окно с сообщением,
        // в зависимости от кода ошибки и переданного сообщения
        console.error('Error: ', message);

        this.closeModal();
        if (code === 404) this.props.gameWasRemovedAlert('Шаг не может быть совершен, игра была прервана');
        if (code === 500) this.props.serverInternalErrorAlert();
    }
}

export default StyledGameList(GameList);
