import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as middleware from 'webpack-dev-middleware';
import * as config from '../../frontend/config/webpack.config';

interface IRoute {
    path: string;

    callback(req: any, res: any): void;
}

class App {
    private app;
    private port = 5000;
    private routes: IRoute[] = [
        {
            callback: (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/index.html"));
            },
            path: '/',
        },
        {
            callback: (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/index.html"));
            },
            path: '/game/:id',
        },
    ];

    constructor() {
        this.app = express();
        this.mountRoutes();
        this.initializeServer = this.initializeServer.bind(this);
    }

    public initializeServer(): void {
        const compiler = webpack(config);

        this.app.use(middleware(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath,
        }));

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

        const callbackfn = (item: IRoute): void => {
            router.get(item.path, item.callback);

            this.app.use(item.path, router);
        };

        this.routes.forEach(callbackfn);
    }
}

export default new App().initializeServer;
