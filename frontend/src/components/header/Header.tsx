import * as React from 'react';
import * as styled from './styles';

interface IHeader {
    className?: string;
}

class Header extends React.Component<IHeader, {}> {
    public render(): JSX.Element {
        return (
            <header className={this.props.className}>
                <styled.Title>Tic Tac Toe</styled.Title>
            </header>
        );
    }
}

export default styled.Header(Header);