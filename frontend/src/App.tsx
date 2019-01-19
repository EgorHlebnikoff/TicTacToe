import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import GameScreen from './components/GameScreen';
import MainScreen from './components/MainScreen';

const App = () => (
    <div>
        <Route exact={true} path='/' component={MainScreen}/>
        <Route path='/game' component={GameScreen}/>
    </div>
);

ReactDOM.render(
    (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    ),
    document.getElementById('app') as HTMLElement,
);
