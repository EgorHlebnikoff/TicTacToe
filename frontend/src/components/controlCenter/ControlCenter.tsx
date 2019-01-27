import * as React from 'react';
import Cookies from '../../modules/cookie/Cookie';
import {fetchNewGameAction} from "../../modules/fetch/FetchModule";
import {ICreateGameResponse} from "../../modules/fetch/FetchModuleTypes";
import {Button, ButtonContainer, TransparentButton, TransparentLinkButton} from '../button/Button';
import Input from '../input/Input';
import Modal from '../modal/Modal';
import Preloader from '../preloader/Preloader';
import Section from '../section/Section';
import Span from "../span/Span";
import {IControlCenterProps, IControlCenterState} from "./ControlCenterTypes";

export default class ControlCenter extends React.Component<IControlCenterProps, IControlCenterState> {
    constructor(props: any) {
        super(props);

        this.state = {
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
        const userName = Cookies.get('userName');

        return (
            <Section backgroundColor='#fafafa'>
                <Input
                    ref={this.props.userNameInputRef}
                    onChange={this.handleInputChange}
                    value={userName}
                    placeholder="Введите ваше имя"
                    type="text"
                />
                <Button onClick={this.tryToCreateGame}>Создать игру</Button>
                {this.state.isModalOpen && this.renderModal()}
            </Section>
        );
    }

    private renderModal(): JSX.Element {
        const {isModalOpen}: IControlCenterState = this.state;

        return (
            <Modal
                title='Создание игры'
                isOpen={isModalOpen}
                onClose={this.closeModal}
                closeByOutsideClick={false}
                closeByESC={false}
                className='gameCreationModal'
            >
                {this.renderModalContent()}
            </Modal>
        );
    }

    private renderModalContent(): JSX.Element {
        const {isGameReady, annotationToGameCreation}: IControlCenterState = this.state;

        return (
            <React.Fragment>
                <Preloader isComplete={isGameReady}/>
                <Span className='center'>{annotationToGameCreation}</Span>
                <ButtonContainer>
                    {this.renderModalButtons(isGameReady)}
                </ButtonContainer>
            </React.Fragment>
        );
    }

    private renderModalButtons(isGameReady: boolean): JSX.Element {
        const {currentGameToken}: IControlCenterState = this.state;
        const continueButtonClassName = isGameReady ? 'continue' : '';

        return (
            <React.Fragment>
                <TransparentButton onClick={this.closeModal}>Отменить</TransparentButton>
                <TransparentLinkButton
                    className={continueButtonClassName}
                    href={`/game/${currentGameToken}`}
                    disabled={!isGameReady}
                >
                    Перейти
                </TransparentLinkButton>
            </React.Fragment>
        );
    }

    private setGameReady(gameToken: string): void {
        const annotation: string = `Игра готова! Передайте ваш gameToken ${gameToken} `
            + `другим игрокам, чтобы они могли присоедениться!`;

        this.setState({
            isGameReady: true,
            annotationToGameCreation: annotation,
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
        const input: HTMLInputElement = this.props.userNameInputRef.current;
        if (!input) return;

        if (!input.classList.contains('error')) return;
        if (input.value === '') return;

        input.classList.remove('error');
    }

    private triggerUserNameInputError(): void {
        const input: HTMLInputElement = this.props.userNameInputRef.current;

        input.classList.add('error');
        input.focus();

        return;
    }

    private async tryToCreateGame(): Promise<void> {
        const input: HTMLInputElement = this.props.userNameInputRef.current;
        if (!input) return;

        const inputValue: string = input.value;
        if (inputValue === '') return this.triggerUserNameInputError();

        this.openModal();

        try {
            const {status, message, gameToken, accessToken}: ICreateGameResponse = await fetchNewGameAction(inputValue);
            if (status === 'error') return this.handlerRequestError(message);

            Cookies.setGameCookies(gameToken, accessToken, 'owner');
            Cookies.setNameCookies(inputValue);

            this.setGameReady(gameToken);
        } catch (error) {
            this.handlerRequestError(error);
        }
    }

    private handlerRequestError(message: string) {
        console.error('Error:', message);

        this.closeModal();
        this.props.serverInternalErrorAlert();
    }
}
