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
            </Section>
        );
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

            return;
        }

        console.log(inputValue);
    }
}
