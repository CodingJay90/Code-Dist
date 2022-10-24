import 'module-alias/register';
import 'reflect-metadata';
import 'dotenv/config';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import config from '@/config/config';
import { DirectoryResolver } from '@/graphql/directory/directory.resolver';
import { FileResolver } from '@/graphql/file/file.resolver';
validateEnv();

const resolvers = [DirectoryResolver, FileResolver];

const app = new App(resolvers, Number(config.server.port));

app.bootstrap();
