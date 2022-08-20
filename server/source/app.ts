import express, { Application } from 'express';
import healthCheck from 'express-healthcheck';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import Controller from '@/types/controller.interface';
import logger from './config/logger';
import ErrorMiddleware from '@/middleware/error.middleware';
import connectDb from '@/config/db';
import path from 'path';
import { multerUpload } from './middleware/multer.middleware';

const NAMESPACE = 'Server';

class App {
    public app: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;

        connectDb;
        this.logRequests();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    public startServer(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running port ${this.port}`);
        });
    }

    private initializeMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        // this.app.use(
        //     express.static(path.join(__dirname, '..', '..', 'testClient'))
        // );
        // this.app.get('/', (req, res) => {
        //     res.sendFile(
        //         path.join(__dirname, '..', '..', 'testClient', 'index.html')
        //     );
        // });

        // this.app.post('/single', multerUpload.single('avatar'), (req, res) => {
        //     console.log(req.file);
        //     res.send('single fle upload success');
        // });
        this.app.use(
            '/healthCheck',
            healthCheck({
                healthy: function () {
                    return {
                        status: 'up and healthy',
                        upTime: process.uptime(),
                    };
                },
            })
        );

        this.app.use(ErrorMiddleware);
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.app.use('/api', controller.router);
        });
        this.app.use((req, res, next) => {
            const error = new Error('Not found');

            res.status(404).json({
                message: error.message,
                status: 404,
            });
        });
    }

    private logRequests(): void {
        this.app.use((req, res, next) => {
            logger.info(
                NAMESPACE,
                `METHOD: [${req.method}] - URL: [${req.url}]`
            );

            res.on('finish', () => {
                logger.info(
                    NAMESPACE,
                    `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`
                );
            });

            next();
        });
    }
}

export default App;
