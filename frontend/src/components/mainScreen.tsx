import * as React from 'react';
import GlobalStyle from '../globalStyles';
import Header from './header/header';

class MainScreen extends React.Component {
    public render(): JSX.Element {
        return (
            <div>
                <GlobalStyle/>
                <Header/>
            </div>
        );
    }
}

export default MainScreen;
