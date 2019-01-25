import * as bodyParser from 'body-parser';
import * as express from 'express';
import GamesController from '../controller/GamesController';
import StaticController from '../controller/StaticController';
import {IRoute} from "./AppTypes";
import setWebpackMiddleware from './webpackMiddleware';

class App {
    private readonly app: express.Application;
    private port: string | number = process.env.PORT || 5000;
    private routes: IRoute[] = [
        StaticController.indexRoute,
        StaticController.gamePageRoute,
        ...GamesController.routes,
    ];

    constructor() {
        this.app = express();

        this.app.use(bodyParser.json());
        this.mountRoutes();

        this.initializeServer = this.initializeServer.bind(this);
    }

    public initializeServer(): void {
        if (!process.env.PRODUCTION) setWebpackMiddleware(this.app);

        this.app.listen(this.port, (error: Error) => {
            if (error) {
                console.log(error);

                return;
            }

            console.log(`Application running on port: ${this.port}`);
        });
    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();

        const callbackFunc = (item: IRoute): void => {
            router[item.method](item.path, item.callback);

            this.app.use(item.path, router);
        };

        this.routes.forEach(callbackFunc);
    }
}

export default new App().initializeServer;
