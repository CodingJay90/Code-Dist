import 'reflect-metadata';
import 'module-alias/register';
import 'dotenv/config';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import config from '@/config/config';
// import FileController from '@/resources/file/file.controller';
import DirectoryController from '@/resources/directory/directory.controller';
import { UsersResolver } from './user.resolver';
validateEnv();

// const controllers = [new FileController(), new DirectoryController()];
const resolvers = [UsersResolver];

const app = new App(resolvers, Number(config.server.port));

// app.startServer();
app.bootstrap();
