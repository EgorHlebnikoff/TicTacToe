import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import GamesController from '../controller/GamesController';
import StaticController from '../controller/StaticController';
import {IRoute} from "./AppTypes";
import setWebpackMiddleware from './webpackMiddleware';

dotenv.config();

class App {
    private readonly app: express.Application;
    private readonly routes: IRoute[];

    private port: string | number = process.env.PORT || 5000;

    constructor() {
        this.routes = [...GamesController.routes];
        this.app = express();

        if (!process.env.STATIC_SERVER || process.env.STATIC_SERVER === 'node') {
            this.routes = [StaticController.indexRoute, StaticController.gamePageRoute, ...this.routes];
            this.app.use(express.static('public'));
        }

        this.app.use(bodyParser.json());
        this.mountRoutes();

        this.initializeServer = this.initializeServer.bind(this);
    }

    public initializeServer(): void {
        if (process.env.MODE !== 'production') setWebpackMiddleware(this.app);

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
