import * as express from "express";

export interface IRoute {
    path: string;
    method: string;

    callback(req: express.Request, res: express.Response): void;
}