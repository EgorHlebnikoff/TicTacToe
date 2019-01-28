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

        // Если сервером для обработки статики выбран сервер на NodeJS,
        // то добавляет роутинги на .html файлы и подключаем middleware для обработки статики
        if (!process.env.STATIC_SERVER || process.env.STATIC_SERVER === 'node') {
            this.routes = [StaticController.indexRoute, StaticController.gamePageRoute, ...this.routes];
            this.app.use(express.static('public'));
        }

        this.app.use(bodyParser.json());

        //Подключаем роутинги к серверу
        this.mountRoutes();

        this.initializeServer = this.initializeServer.bind(this);
    }

    public initializeServer(): void {
        //Если сборка в режиме разработки, то подключаем middleware для сборки исходников с фронта
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

        // Для каждого роутинга в обекте this.routes подключаем его
        // к express.Router с переданным методом и callback методом
        const callbackFunc = (item: IRoute): void => {
            router[item.method](item.path, item.callback);

            this.app.use(item.path, router);
        };

        this.routes.forEach(callbackFunc);
    }
}

export default new App().initializeServer;
