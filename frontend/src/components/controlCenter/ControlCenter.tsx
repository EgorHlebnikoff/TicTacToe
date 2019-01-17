import * as React from 'react';
import {Button, ButtonContainer, TransparentButton} from '../button/Button';
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
                    <TransparentButton
                        className={continueButtonClassName}
                        disabled={!isGameReady}
                    >
                        Перейти
                    </TransparentButton>
                </ButtonContainer>
            </Modal>
        );
    }

    private setGameReady(): void {
        this.setState({
            isGameReady: true,
            annotationToGameCreation: 'Игра готова! Можно приступать!',
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
        console.log(inputValue);
    }
}
