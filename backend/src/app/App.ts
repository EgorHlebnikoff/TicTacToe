import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as webpack from 'webpack';
import * as middleware from 'webpack-dev-middleware';
import * as config from '../../frontend/config/webpack.config';
import GamesController from '../controller/GamesController';
import StaticController from '../controller/StaticController';

export interface IRoute {
    path: string;
    method: string;

    callback(req: any, res: any): void;
}

class App {
    private app;
    private port = 5000;
    private routes: IRoute[] = [
        StaticController.indexRoute,
        StaticController.gamePageRoute,
        GamesController.createGameRoute,
        GamesController.gamesListRoute,
        GamesController.joinGameRoute,
    ];

    constructor() {
        this.app = express();
        this.initializeServer = this.initializeServer.bind(this);
    }

    public initializeServer(): void {
        const compiler = webpack(config);

        this.app.use(middleware(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath,
        }));

        this.app.use(bodyParser.json());
        this.mountRoutes();

        this.app.listen(this.port, (error: Error) => {
            if (error) {
                console.log(error);

                return;
            }

            console.log(`Application running on port: ${this.port}`);
        });
    }

    private mountRoutes(): void {
        const router = express.Router();

        const callbackFunc = (item: IRoute): void => {
            if (item.method === 'get')
                router.get(item.path, item.callback);
            else
                router.post(item.path, item.callback);

            this.app.use(item.path, router);
        };

        this.routes.forEach(callbackFunc);
    }
}

export default new App().initializeServer;
