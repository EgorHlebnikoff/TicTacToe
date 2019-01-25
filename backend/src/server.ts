import 'reflect-metadata';
import initializeServer from './app/App';
import connectToDB from './database/index';

connectToDB.then(initializeServer).catch((error: Error) => console.log(error));
