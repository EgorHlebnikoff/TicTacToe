import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Header from './header/Header';

class GameScreen extends React.Component {
    public render(): JSX.Element[] {
        return ([
            <GlobalStyle key='globalStyles'/>,
            <Header key='header'/>,
        ]);
    }
}

export default GameScreen;
