import * as dotenv from 'dotenv';
import {ConnectionOptions, createConnection} from "typeorm";
import {Game} from '../entity/Game';

dotenv.config();

const getDBParameter: (parameterName: string) => string | false = (parameterName: string): string | false => {
    const envVariable: string = process.env[parameterName];
    if (!envVariable && envVariable !== '') return false;

    return envVariable;
};

let DBConnectionURL: string | false = getDBParameter('DB_URL');

if (!DBConnectionURL) {
    const DBUser = getDBParameter('DB_USER') || 'tic_tac_toe_user';
    const DBPassword = getDBParameter('DB_PASSWORD') || 'tictactoe';
    const DBHost = getDBParameter('DB_HOST') || 'localhost';
    const DBPort = getDBParameter('DB_PORT') || '5432';
    const DBName = getDBParameter('DB_NAME') || 'tic_tac_toe';

    DBConnectionURL = `postgres://${DBUser}:${DBPassword}@${DBHost}:${DBPort}/${DBName}`;
}

const options: ConnectionOptions = {
    type: "postgres",
    url: DBConnectionURL,
    synchronize: true,
    logging: process.env.MODE !== 'production',
    entities: [Game],
};

export default createConnection(options);
