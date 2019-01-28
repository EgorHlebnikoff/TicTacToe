import * as React from 'react';
import {ButtonContainer, TransparentButton} from "../components/button/Button";
import Container from "../components/container/Container";
import GameField from "../components/gameField/GameField";
import {IGameField} from "../components/gameField/GameFieldTypes";
import Header from '../components/header/Header';
import Modal from "../components/modal/Modal";
import PlayerBar from '../components/playerBar/PlayerBar';
import Span from "../components/span/Span";
import GlobalStyle from '../globalStyles';
import checkGameState from "../modules/checker/Checker";
import Cookie from "../modules/cookie/Cookie";
import {fetchDoStepAction, fetchGameData, fetchGameStatus, fetchSurrenderAction} from "../modules/fetch/FetchModule";
import {IErrorResponse, IGameDataResponse, IGameStatusResponse} from "../modules/fetch/FetchModuleTypes";
import {GameState, IGameScreenProps, IGameScreenState, UserType} from "./types/GameScreenTypes";

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
    private readonly gameToken: string = this.props.match.params.gameToken;
    private readonly currPlayerAccessToken: string | null = this.setAccessToken();
    private readonly currPlayerStatus: UserType = this.setUserType();
    private readonly currPlayerMark: string = this.setUserMark();

    private fetchGameStatusTimeout: WindowTimers | number = null;
    private fetchGameDataTimeout: WindowTimers | number = null;

    constructor(props: IGameScreenProps) {
        super(props);

        this.state = {
            field: ['???', '???', '???'],
            time: 0,
            gameState: GameState.WAITING,
            players: {
                owner: 'LOADING',
                opponent: 'LOADING',
            },
            youTurn: false,
            isAlertModalOpen: false,
            alertMessage: '',
        };

        this.fetchGameData();

        this.handleTurn = this.handleTurn.bind(this);
        this.handleSurrender = this.handleSurrender.bind(this);
        this.fetchGameData = this.fetchGameData.bind(this);
        this.fetchGameStatus = this.fetchGameStatus.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
    }

    public render(): JSX.Element {
        const gameFieldProps: IGameField = {
            turnHandler: this.handleTurn,
            surrenderHandler: this.handleSurrender,
            userType: this.currPlayerStatus,
            ...this.state,
        };

        return (
            <React.Fragment>
                <GlobalStyle key='globalStyles'/>
                <Header key='header'/>
                <Container key={'container'}>
                    <PlayerBar playerType={this.currPlayerStatus} players={this.state.players}/>
                    <GameField {...gameFieldProps}/>
                </Container>
                {this.state.isAlertModalOpen && this.renderModal()}
            </React.Fragment>
        );
    }

    private renderModal(): JSX.Element {
        return (
            <Modal
                title='Внимание!'
                isOpen={this.state.isAlertModalOpen}
                onClose={this.closeAlertModal}
                closeByOutsideClick={true}
                closeByESC={true}
                className='alertModal'
            >
                <Span classList='center'>{this.state.alertMessage}</Span>
                <ButtonContainer>
                    <TransparentButton onClick={this.closeAlertModal}>Закрыть</TransparentButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private closeAlertModal(): void {
        if (this.state.callback)
            this.state.callback();

        this.setState({
            isAlertModalOpen: false,
            alertMessage: '',
            callback: null,
        });
    }

    private openAlertModal(alertMessage: string, callback?: () => Promise<void>) {
        this.setState({
            isAlertModalOpen: true,
            alertMessage,
            callback,
        });
    }

    private unauthorizedAlert(): void {
        this.openAlertModal('Шаг не может быть совершен, ' +
            'вы не авторизированы в игре как игрок', this.fetchGameData.bind(this));
    }

    private gameWasRemovedAlert(message: string): void {
        this.openAlertModal(`${message} после 5 минут отсутвия активности.`);
    }

    private serverInternalErrorAlert(): void {
        this.openAlertModal('Произошла ошибка на стороне сервера. Обновите страницу.');
    }

    private setUserType(): UserType {
        // Получаем куки игр, если они отсутсвуют или в них нет информации о текущей игре
        // распознаем пользователя как зрителя и отдаем нужное состояние
        const gameCookies = Cookie.get('games');
        if (!gameCookies || !gameCookies[this.gameToken]) return UserType.VIEWER;

        // Получаем тип пользователя из куков, и отдаем нужное состояние, в зависимости от полученного типа
        const {type}: { type: string } = gameCookies[this.gameToken];

        return type === 'owner' ? UserType.OWNER : UserType.OPPONENT;
    }

    private setUserMark(): string {
        // Получаем куки игр, если они отсутствуют, или в них не информации о существующей игре
        // отдаем знак пустой ячейки
        const gameCookies = Cookie.get('games');
        if (!gameCookies || !gameCookies[this.gameToken]) return '?';

        // Возращаем знак из куков
        return gameCookies[this.gameToken].mark;
    }

    private setAccessToken(): string | null {
        // Получаем куки игр, если они отсутствуют, или в них не информации о существующей игре отдаем null
        const gameCookies = Cookie.get('games');
        if (!gameCookies || !gameCookies[this.gameToken]) return null;

        // Возращаем accessToken из куков
        return gameCookies[this.gameToken].accessToken;
    }

    private async handleTurn([row, column]: number[]): Promise<void> {
        clearTimeout(this.fetchGameStatusTimeout as number);

        // Преобразуем текущее поле в новое, путем обхода строк и замены нужного символа
        // в полученном столбце полученной строки на знак игрока
        const newField: string[] = this.state.field.map((currRow: string, rowNum: number): string => {
            if (rowNum !== row) return currRow;

            const columns: string[] = currRow.split('');
            columns[column] = this.currPlayerMark;

            return columns.join('');
        });

        const newGameState: string = checkGameState(newField);

        this.setAfterTurnGameState(newField, newGameState);

        // Передаем информацию о ходе серверу, если сервер обработал корректно - получем существующий статус игры,
        // иначе обрабатываем ошибку
        try {
            const {status, code, message}: IErrorResponse = await fetchDoStepAction(
                [row, column],
                this.currPlayerAccessToken,
            );

            if (status === 'error') return this.handleRequestError(code, message);

            await this.fetchGameStatus();
        } catch (error) {
            this.handleRequestError(500, error);
        }
    }

    private setAfterTurnGameState(newField: string[], newGameState: string): void {
        // Если новое состояние - состояние игры или пользователь является зрителем - меняем только поле и флаг шага
        if (newGameState === 'playing' || this.currPlayerStatus === UserType.VIEWER) {
            this.setState({
                field: newField,
                youTurn: false,
            });

            return;
        }

        // Если состояние игры стало "ничья" или "победа" - выставляет нужное состояние и победителя, если есть
        const gameState: GameState = newGameState === 'won' ? GameState.WON : GameState.DRAW;
        const winner: string = gameState === GameState.WON ? this.state.players[this.currPlayerStatus] : null;

        this.setState({
            field: newField,
            youTurn: false,
            gameState,
            winner,
        });
    }

    private async handleSurrender(): Promise<void> {
        // Отдаем серверу на обработку сообщение о том, что игрок сдался, если сервер вернул ошибку - обрабатываем её
        try {
            const {status, code, message}: IErrorResponse = await fetchSurrenderAction(this.currPlayerAccessToken);

            if (status === 'error') return this.handleRequestError(code, message);
        } catch (error) {
            this.handleRequestError(500, error);
        }
    }

    private async fetchGameData(): Promise<void> {
        // Получаем данные игры с сервера, если все хорошо - обрабатываем их, иначе - обрабатываем ошибку
        try {
            const data: IGameDataResponse = await fetchGameData(this.gameToken);

            const {status, code, message, state}: IGameDataResponse = data;
            if (status === 'error') return this.handleRequestError(code, message);

            this.handleGameState(state, data);
        } catch (error) {
            this.handleRequestError(500, error);
        }
    }

    private handleGameState(state: string, data: IGameDataResponse) {
        if (state === 'done') return this.gameDoneStateHandler({...data});
        if (state === 'ready') return this.gameReadyStateHandler({...data});
        if (state === 'playing') return this.gamePlayingStateHandler({...data});
    }

    private gameDoneStateHandler({owner, opponent, gameResult, gameDuration, field}: IGameDataResponse) {
        let gameState: GameState;
        let winner: string;

        // Устанавливаем корретное состояние игры, в зависимости от полученного состояния с сервера,
        // если ига была закончена победой - устанавливаем победителя
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

    private gameReadyStateHandler({owner, opponent, gameDuration, field}: IGameDataResponse) {
        // Устанавливаем нужные состояния, затем устанавливаем таймер на следующее обращение к серверу
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

    private gamePlayingStateHandler({owner, opponent, gameDuration, field}: IGameDataResponse) {
        // Устанавливаем нужные состояния, затем, если пользователь является игроком
        // - запрашиваем нынешнее состояние с сервера, иначе устанавливаем таймер на следующее обращение к серверу
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

    private async fetchGameStatus(): Promise<void> {
        // Получаем статус игры с сервера, если все хорошо - обрабатываем его, иначе - обрабатываем ошибку
        try {
            const data: IGameStatusResponse = await fetchGameStatus(this.currPlayerAccessToken);

            const {status, code, message}: IGameStatusResponse = data;
            if (status === 'error') return this.handleRequestError(code, message);

            this.handleFetchedGameStatusData(data);
        } catch (error) {
            this.handleRequestError(500, error);
        }
    }

    private handleFetchedGameStatusData({...data}: IGameStatusResponse): void {
        const {youTurn, gameDuration, field, winner}: IGameStatusResponse = data;

        // Устанавливаем корретное состояние игры и таймер, на следующее обращение к серверу, за статусом игры
        const gameState: GameState = winner && winner !== ''
            ? winner === 'draw'
                ? GameState.DRAW
                : GameState.WON
            : this.state.gameState;

        this.setState({youTurn, time: gameDuration, field, winner, gameState});

        if (gameState === GameState.PLAYING)
            this.fetchGameStatusTimeout = setTimeout(this.fetchGameStatus, 2000);
    }

    private handleRequestError(code: number, message: string): void {
        // В зависимости от переданного кода ошибки и сообщения, выводим сообщение в консоль
        // и вызываем необходимую функцию открывающую модальное окно с правильным сообщением
        console.error('Error: ', message);

        if (code === 403) this.unauthorizedAlert();
        if (code === 404) this.gameWasRemovedAlert('Шаг не может быть совершен, игра была прервана');
        if (code === 500) this.serverInternalErrorAlert();
    }
}
