import 'module-alias/register';
import 'dotenv/config';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import config from '@/config/config';
import FileController from '@/resources/file/file.controller';
import DirectoryController from '@/resources/directory/directory.controller';

validateEnv();

const controllers = [new FileController(), new DirectoryController()];

const app = new App(controllers, Number(config.server.port));

app.startServer();
