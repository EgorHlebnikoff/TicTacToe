import 'reflect-metadata';
import {createConnection} from "typeorm";
import initializeServer from './app/App';
import options from './database';

createConnection(options).then(initializeServer).catch((error: Error) => console.log(error));
