import * as React from 'react';
import Cookies from 'universal-cookie';
import {Button, ButtonContainer, TransparentButton, TransparentLinkButton} from '../button/Button';
import Input from '../input/Input';
import Modal from '../modal/Modal';
import Preloader from '../preloader/Preloader';
import Section from '../section/Section';
import Span from "../span/Span";

enum ButtonState {NORMAL = "NORMAL", ERROR = "ERROR"}

interface IControlCenterState {
    buttonState: ButtonState;
    isModalOpen: boolean;
    isGameReady: boolean;
    annotationToGameCreation: string;
    currentGameToken: string;
}

export default class ControlCenter extends React.Component<any, IControlCenterState> {
    private textInputRef = React.createRef<HTMLInputElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            buttonState: ButtonState.NORMAL,
            isModalOpen: false,
            isGameReady: false,
            annotationToGameCreation: 'Ваша игра готовится...',
            currentGameToken: '',
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setGameReady = this.setGameReady.bind(this);
        this.tryToCreateGame = this.tryToCreateGame.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    public render(): JSX.Element {
        return (
            <Section backgroundColor='#fafafa'>
                <Input
                    ref={this.textInputRef}
                    color={this.state.buttonState}
                    onChange={this.handleInputChange}
                    placeholder="Введите ваше имя"
                    type="text"
                />
                <Button onClick={this.tryToCreateGame}>Создать игру</Button>
                {this.state.isModalOpen && this.renderModal()}
            </Section>
        );
    }

    private renderModal(): JSX.Element {
        const {isGameReady, annotationToGameCreation, isModalOpen} = this.state;
        const continueButtonClassName = isGameReady ? 'continue' : '';

        return (
            <Modal
                title={'Создание игры'}
                isOpen={isModalOpen}
                onClose={this.closeModal}
                closeByOutsideClick={false}
                closeByESC={false}
                className='gameCreationModal'
            >
                <Preloader isComplete={this.state.isGameReady}/>
                <Span>{annotationToGameCreation}</Span>
                <ButtonContainer>
                    <TransparentButton onClick={this.closeModal}>Отменить</TransparentButton>
                    <TransparentLinkButton
                        className={continueButtonClassName}
                        href={`/game/${this.state.currentGameToken}`}
                        disabled={!isGameReady}
                    >
                        Перейти
                    </TransparentLinkButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private setGameReady(gameToken: string): void {
        this.setState({
            isGameReady: true,
            annotationToGameCreation: 'Игра готова! Можно приступать!',
            currentGameToken: gameToken,
        });
    }

    private openModal(): void {
        this.setState({isModalOpen: true});
    }

    private closeModal(): void {
        this.setState({isModalOpen: false});
    }

    private handleInputChange(): void {
        if (this.state.buttonState === ButtonState.NORMAL) return;

        const input = this.textInputRef.current;
        if (!input || input.value === '') return;

        this.setState({buttonState: ButtonState.NORMAL});
    }

    private tryToCreateGame(): void {
        const input = this.textInputRef.current;
        if (!input) return;

        const inputValue: string = input.value;
        if (inputValue === '') {
            this.setState({buttonState: ButtonState.ERROR});
            input.focus();

            return;
        }

        this.openModal();

        fetch('/games/new', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userName: inputValue,
                size: 3,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                const {status, code, gameToken, accessToken} = response;
                if (status === 'ok' && code === 0) {
                    const cookies = new Cookies();
                    let gameCookies = cookies.get('games');
                    if (!gameCookies) gameCookies = {};

                    gameCookies[gameToken] = {
                        accessToken,
                        type: 'owner',
                    };
                    cookies.set('games', gameCookies, {path: '/'});

                    this.setGameReady(gameToken);
                }
            })
            .catch((error: Error) => console.error('Error:', error));
    }
}
