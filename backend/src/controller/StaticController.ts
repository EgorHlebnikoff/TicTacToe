import * as path from "path";
import {IRoute} from '../app/App';

class StaticController {
    public indexRoute: IRoute;
    public gamePageRoute: IRoute;

    constructor() {
        this.indexRoute = {
            callback: this.indexRouteCallback,
            path: '/',
            method: 'get',
        };

        this.gamePageRoute = {
            callback: this.gamePageRouteCallback,
            path: '/game/:token',
            method: 'get',
        };
    }

    private indexRouteCallback(req: any, res: any): void {
        res.sendFile(path.join(__dirname, "../../public/index.html"));
    }

    private gamePageRouteCallback(req: any, res: any): void {
        res.sendFile(path.join(__dirname, "../../public/index.html"));
    }
}

export default new StaticController();
