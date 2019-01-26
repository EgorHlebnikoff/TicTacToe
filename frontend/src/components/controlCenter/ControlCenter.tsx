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

    private static triggerUserNameInputError(input: HTMLInputElement): void {
        input.classList.add('error');
        input.focus();

        return;
    }

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
                <Span className='center'>{annotationToGameCreation}</Span>
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

    private async tryToCreateGame(): Promise<void> {
        const input: HTMLInputElement = this.props.userNameInputRef.current;
        if (!input) return;

        const inputValue: string = input.value;
        if (inputValue === '') return ControlCenter.triggerUserNameInputError(input);

        this.openModal();

        try {
            const {
                status,
                code,
                message,
                gameToken,
                accessToken,
            }: ICreateGameResponse = await fetchNewGameAction(inputValue);

            if (status === 'error') {
                console.error('Error: ', message);

                this.closeModal();
                if (code === 500) this.props.serverInternalErrorAlert();

                return;
            }

            Cookies.setGameCookies(gameToken, accessToken);
            Cookies.setNameCookies(inputValue);

            this.setGameReady(gameToken);
        } catch (error) {
            console.error('Error:', error);

            this.closeModal();
            this.props.serverInternalErrorAlert();
        }
    }
}
