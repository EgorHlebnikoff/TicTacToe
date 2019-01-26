import * as React from 'react';
import {ButtonContainer, TransparentButton} from "../components/button/Button";
import Container from "../components/container/Container";
import ControlCenter from '../components/controlCenter/ControlCenter';
import GamesList from "../components/gamesList/GamesList";
import Header from '../components/header/Header';
import Modal from "../components/modal/Modal";
import Span from "../components/span/Span";
import GlobalStyle from '../globalStyles';

interface IMainScreenState {
    isAlertModalOpen: boolean;
    alertMessage: string;
    callback?: () => Promise<void>;
}

class MainScreen extends React.Component<{}, IMainScreenState> {
    private userNameInputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    constructor(props: {}) {
        super(props);

        this.state = {
            isAlertModalOpen: false,
            alertMessage: '',
        };

        this.gameWasRemovedAlert = this.gameWasRemovedAlert.bind(this);
        this.serverInternalErrorAlert = this.serverInternalErrorAlert.bind(this);
    }

    public render(): JSX.Element {
        const componentProps = {
            gameWasRemovedAlert: this.gameWasRemovedAlert,
            serverInternalErrorAlert: this.serverInternalErrorAlert,
            userNameInputRef: this.userNameInputRef,
        };

        return (
            <React.Fragment>
                <GlobalStyle key='globalStyles'/>
                <Header key='header'/>
                <Container key={'container'}>
                    <ControlCenter {...componentProps}/>
                    <GamesList {...componentProps}/>
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

    private gameWasRemovedAlert(message: string): void {
        this.openAlertModal(`${message} после 5 минут отсутвия активности.`);
    }

    private serverInternalErrorAlert(): void {
        this.openAlertModal('Произошла ошибка на стороне сервера. Обновите страницу.');
    }
}

export default MainScreen;
