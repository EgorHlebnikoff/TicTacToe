import * as React from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Modal from '../modal/Modal';
import Section from '../section/Section';

enum ButtonState {NORMAL = "NORMAL", ERROR = "ERROR"}

interface IControlCenterState {
    buttonState: ButtonState;
    isModalOpen: boolean;
}

export default class ControlCenter extends React.Component<any, IControlCenterState> {
    private textInputRef = React.createRef<HTMLInputElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            buttonState: ButtonState.NORMAL,
            isModalOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.tryToCreateGame = this.tryToCreateGame.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
    }

    public render(): JSX.Element {
        return (
            <Section backgroundColor='#fafafa'>
                <Input
                    ref={this.textInputRef}
                    color={this.state.buttonState}
                    onFocus={this.handleInputFocus}
                    placeholder="Введите ваше имя"
                    type="text"
                />
                <Button onClick={this.tryToCreateGame}>Создать игру</Button>
                {this.state.isModalOpen && this.renderModal()}
            </Section>
        );
    }

    private renderModal(): JSX.Element {
        return (
            <Modal
                isOpen={this.state.isModalOpen}
                onClose={this.closeModal}
                closeByOutsideClick={false}
                closeByESC={false}
            />
        );
    }

    private openModal(): void {
        this.setState({isModalOpen: true});
    }

    private closeModal(): void {
        this.setState({isModalOpen: false});
    }

    private handleInputFocus(): void {
        if (this.state.buttonState === ButtonState.NORMAL) return;

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
