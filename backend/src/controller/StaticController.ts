import * as express from 'express';
import * as path from "path";
import {IRoute} from '../app/AppTypes';

class StaticController {
    public indexRoute: IRoute;
    public gamePageRoute: IRoute;

    private pathToIndexHTML: string = path.join(__dirname, "../../public/index.html");

    constructor() {
        this.indexRoute = {
            callback: this.indexRouteCallback.bind(this),
            path: '/',
            method: 'get',
        };

        this.gamePageRoute = {
            callback: this.gamePageRouteCallback.bind(this),
            path: '/game/:token',
            method: 'get',
        };
    }

    private indexRouteCallback(req: express.Request, res: express.Response): void {
        res.sendFile(this.pathToIndexHTML);
    }

    private gamePageRouteCallback(req: express.Request, res: express.Response): void {
        res.sendFile(this.pathToIndexHTML);
    }
}

export default new StaticController();
