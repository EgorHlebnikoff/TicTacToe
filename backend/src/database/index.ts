import {ConnectionOptions} from "typeorm";
import {Game} from '../entity/Game';

const options: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "tic_tac_toe_user",
    password: "tictactoe",
    database: "tic_tac_toe",
    synchronize: true,
    logging: true,
    entities: [Game],
};

export default options;
