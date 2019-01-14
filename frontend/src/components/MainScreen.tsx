import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Container from "./container/Container";
import ControlCenter from './controlCenter/ControlCenter';
import GamesList from "./gamesList/GamesList";
import Header from './header/Header';

class MainScreen extends React.Component {
    public render(): JSX.Element[] {
        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
            (
                <Container key={'container'}>
                    <ControlCenter/>
                    <GamesList/>
                </Container>
            ),
        ]);
    }
}

export default MainScreen;
