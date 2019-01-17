import * as React from "react";
import {ButtonContainer, TransparentButton} from "../button/Button";
import GameCard, {GameState, IPlayer, PlayerState} from '../gameCard/GameCard';
import Modal from "../modal/Modal";
import Span from "../span/Span";
import StyledGameList from './styles';

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

    constructor(props: IGameList) {
        super(props);

        this.state = {
            isModalOpen: false,
        };

        this.getGame = this.getGame.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
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
        return (
            <Modal
                key='Modal'
                title='Подвердить'
                isOpen={this.state.isModalOpen}
                onClose={this.closeModal}
                closeByOutsideClick={true}
                closeByESC={true}
                className='verifyRedirectionModal'
            >
                <Span>Вы уверены, что хотите перейти к игре?</Span>
                <ButtonContainer>
                    <TransparentButton onClick={this.closeModal}>Нет</TransparentButton>
                    <TransparentButton className='continue'>Да</TransparentButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private openModal(): void {
        if (this.state.isModalOpen) return;

        this.setState({isModalOpen: true});
    }

    private closeModal(): void {
        if (!this.state.isModalOpen) return;

        this.setState({isModalOpen: false});
    }

    private getGame(currArray: JSX.Element[], currGame: IGameParams): JSX.Element[] {
        const id = currGame.gameToken;
        const time = currGame.gameDuration;
        const players: IPlayer[] = GameList.getGamePlayers(currGame);
        const state = GameList.getGameState(currGame);

        currArray.push((
            <GameCard key={id} players={players} time={time} state={state} onClick={this.openModal}/>
        ));

        return currArray;
    }

    private getCards(): JSX.Element[] {
        return games.reduce(this.getGame, []);
    }
}

export default StyledGameList(GameList);
