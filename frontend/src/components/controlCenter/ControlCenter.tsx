import * as React from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Section from '../section/Section';

enum ButtonState {NORMAL = "NORMAL", ERROR = "ERROR"}

interface IControlCenterState {
    buttonState: ButtonState;
}

export default class ControlCenter extends React.Component<any, IControlCenterState> {
    private textInputRef = React.createRef<HTMLInputElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            buttonState: ButtonState.NORMAL,
        };
    }

    public render(): JSX.Element {
        return (
            <Section>
                <Input
                    ref={this.textInputRef}
                    color={this.state.buttonState}
                    onFocus={this.handleFocus}
                    placeholder="Введите ваше имя"
                    type="text"
                />
                <Button onClick={this.handleClick}>Создать игру</Button>
            </Section>
        );
    }

    private handleFocus: () => void = (): void => this.handleInputFocus();

    private handleClick: () => void = (): void => this.tryToCreateGame();

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

            return;
        }

        console.log(inputValue);
    }
}
