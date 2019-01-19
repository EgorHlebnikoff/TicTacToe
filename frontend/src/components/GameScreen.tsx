import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Container from "./container/Container";
import Header from './header/Header';
import PlayerBar from './playerBar/PlayerBar';

class GameScreen extends React.Component {
    public render(): JSX.Element[] {
        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
            (
                <Container key={'container'}>
                    <PlayerBar/>
                </Container>
            ),
        ]);
    }
}

export default GameScreen;
