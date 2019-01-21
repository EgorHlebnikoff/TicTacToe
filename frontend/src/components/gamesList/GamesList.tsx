import * as React from "react";
import {ButtonContainer, TransparentButton, TransparentLinkButton} from "../button/Button";
import GameCard, {GameState, IPlayer, PlayerState} from '../gameCard/GameCard';
import Input from "../input/Input";
import Modal from "../modal/Modal";
import Preloader from "../preloader/Preloader";
import Span from "../span/Span";
import StyledGameList, {PreloaderContainer} from './styles';

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
    isModalOpen: boolean;
    currentGameToken: string;
    currentGameState: string;
    isContinueButtonDisabled: boolean;
}

interface IGameList {
    className?: string;
}

const games: IGameParams[] = [
    {
        gameToken: '123123',
        owner: 'Andry Heineken',
        opponent: '',
        size: 3,
        gameDuration: 60,
        gameResult: '',
        state: 'ready',
    },
    {
        gameToken: '1231as',
        owner: 'Andry Heineken',
        opponent: 'Boris Guinnes',
        size: 3,
        gameDuration: 12312,
        gameResult: '',
        state: 'playing',
    },
    {
        gameToken: '1231ad',
        owner: 'Andry Heineken',
        opponent: 'Boris Guinnes',
        size: 3,
        gameDuration: 12312,
        gameResult: 'owner',
        state: 'done',
    },
    {
        gameToken: '1231a4',
        owner: 'Andry Heineken',
        opponent: 'Boris Guinnes',
        size: 3,
        gameDuration: 12312,
        gameResult: 'opponent',
        state: 'done',
    },
    {
        gameToken: '1231a8',
        owner: 'Andry Heineken',
        opponent: 'Boris Guinnes',
        size: 3,
        gameDuration: 12312,
        gameResult: 'draw',
        state: 'done',
    },
    {
        gameToken: '1231ao',
        owner: 'Andry Heineken',
        opponent: 'Boris Guinnes',
        size: 3,
        gameDuration: 12312,
        gameResult: 'draw',
        state: 'done',
    },
];

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

    private modalInputRef = React.createRef<HTMLInputElement>();
    private preloaderContainerRef = React.createRef<HTMLDivElement>();

    constructor(props: IGameList) {
        super(props);

        this.state = {
            isModalOpen: false,
            currentGameToken: '',
            currentGameState: '',
            isContinueButtonDisabled: false,
        };

        this.getGame = this.getGame.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.redirectToGameHandler = this.redirectToGameHandler.bind(this);
        this.modalInputChangeHandler = this.modalInputChangeHandler.bind(this);
        this.setFocusToModalInput = this.setFocusToModalInput.bind(this);
    }

    public render(): JSX.Element {
        return (
            <section key="gamesList" className={this.props.className}>
                {this.getCards()}
                {this.state.isModalOpen && this.renderModal()}
            </section>
        );
    }

    private renderModal(): JSX.Element {
        const state: string = this.state.currentGameState;
        const spanContent: string = state === 'ENDED'
            ? 'Вы уверены, что хотите посмотреть результаты игры?'
            : state === 'PLAYING'
                ? 'Вы уверены, что хотите наблюдать за этой игрой?'
                : 'Чтобы присоединиться к игре - введите gameToken';

        const isWaiting: boolean = state === 'WAITING';
        const {isContinueButtonDisabled} = this.state;

        return (
            <Modal
                key='Modal'
                title='Подвердить'
                isOpen={this.state.isModalOpen}
                afterOpen={this.setFocusToModalInput}
                onClose={this.closeModal}
                closeByOutsideClick={true}
                closeByESC={true}
                className='verifyRedirectionModal'
            >
                {isWaiting && <PreloaderContainer ref={this.preloaderContainerRef}><Preloader/></PreloaderContainer>}
                <Span>{spanContent}</Span>
                {isWaiting && this.getModalInput()}
                <ButtonContainer>
                    <TransparentButton onClick={this.closeModal}>Нет</TransparentButton>
                    <TransparentLinkButton
                        href={`/game/${this.state.currentGameToken}`}
                        onClick={this.redirectToGameHandler}
                        disabled={isContinueButtonDisabled}
                        className={`${isWaiting ? 'joinGame' : ''} ${!isContinueButtonDisabled ? 'continue' : ''}`}
                    >
                        Да
                    </TransparentLinkButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private getModalInput(): JSX.Element {
        return <Input ref={this.modalInputRef} color="NORMAL" border='full' onChange={this.modalInputChangeHandler}/>;
    }

    private openModal(gameToken: string, state: string): void {
        if (this.state.isModalOpen) return;
        const continueButtonState = state === 'WAITING';

        this.setState({
            isModalOpen: true,
            currentGameToken: gameToken,
            currentGameState: state,
            isContinueButtonDisabled: continueButtonState,
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
            isContinueButtonDisabled: false,
        });
    }

    private modalInputChangeHandler(): void {
        if (!this.modalInputRef) return;
        const input: HTMLInputElement = this.modalInputRef.current;
        const isEmptyValue: boolean = input.value === '';

        if (isEmptyValue && this.state.isContinueButtonDisabled) return;
        if (!isEmptyValue && !this.state.isContinueButtonDisabled) return;

        this.setState({isContinueButtonDisabled: isEmptyValue});
    }

    private redirectToGameHandler(e: MouseEvent): void {
        const eventTarget: HTMLLinkElement = e.target as HTMLLinkElement;
        if (!eventTarget.classList.contains('joinGame')) return;

        if (!this.preloaderContainerRef) return;
        const preloaderContainer: HTMLDivElement = this.preloaderContainerRef.current;

        e.preventDefault();
        preloaderContainer.classList.add('opened');
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

    private getCards(): JSX.Element[] {
        return games.reduce(this.getGame, []);
    }
}

export default StyledGameList(GameList);
