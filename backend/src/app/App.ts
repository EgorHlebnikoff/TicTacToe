import * as express from 'express';
import * as path from 'path';

interface IRoute {
    path: string;

    callback(req: any, res: any): void;
}

class App {
    public express;
    private routes: IRoute[] = [
        {
            callback: (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/index.html"));
            },
            path: '/',
        },
        {
            callback: (req, res) => {
                res.send('hello world');
            },
            path: '/hello',
        },
    ];

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();

        const callbackfn = (item: IRoute): void => {
            router.get(item.path, item.callback);

            this.express.use(item.path, router);
        };

        this.routes.forEach(callbackfn);
    }
}

export default new App().express;
