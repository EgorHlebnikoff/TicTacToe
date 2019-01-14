import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Container from './container/Container';
import GamesList from "./gamesList/GamesList";
import Header from './header/header';

class MainScreen extends React.Component {
    public render(): JSX.Element {
        return (
            <div>
                <GlobalStyle/>
                <Header/>
                <Container>
                    <GamesList/>
                </Container>
            </div>
        );
    }
}

export default MainScreen;
