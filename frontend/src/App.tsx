import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import GameScreen from './routes/GameScreen';
import MainScreen from './routes/MainScreen';

const App = () => (
    <React.Fragment>
        <Route exact={true} path='/' component={MainScreen}/>
        <Route path='/game/:gameToken' component={GameScreen}/>
    </React.Fragment>
);

const AppDOMElement: HTMLElement = document.getElementById('app');

ReactDOM.render(
    (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    ),
    AppDOMElement,
);
