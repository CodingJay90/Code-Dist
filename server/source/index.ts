import 'module-alias/register';
import 'reflect-metadata';
import 'dotenv/config';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import config from '@/config/config';
import { UsersResolver } from './user.resolver';
import { DirectoryResolver } from './resources/Graphql/directory/directory.resolver';
validateEnv();

// const controllers = [new FileController(), new DirectoryController()];
const resolvers = [UsersResolver, DirectoryResolver];

const app = new App(resolvers, Number(config.server.port));

// app.startServer();
app.bootstrap();
