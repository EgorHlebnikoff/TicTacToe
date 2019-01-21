import 'reflect-metadata';
import initializeServer from './app/App';
import connectToDB from './database';

connectToDB.then(initializeServer).catch((error: Error) => console.log(error));
