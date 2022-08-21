import express, { Application } from 'express';
import healthCheck from 'express-healthcheck';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
// import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import logger from './config/logger';
import ErrorMiddleware from '@/middleware/error.middleware';
import connectDb from '@/config/db';

const NAMESPACE = 'Server';

class App {
    public app: Application;
    public port: number;
    private graphQLPath: string = '/graphql';
    private resolvers: any[];

    constructor(resolvers: any[], port: number) {
        this.app = express();
        this.port = port;
        this.resolvers = resolvers;

        connectDb;
        this.logRequests();
        this.initializeMiddleware();
    }

    public async bootstrap() {
        const schema = await buildSchema({
            resolvers: this.resolvers as any,
        });
        const server = new ApolloServer({
            schema,
            // csrfPrevention: true,
            cache: 'bounded',
            // introspection: false,
            plugins: [
                ApolloServerPluginLandingPageGraphQLPlayground({
                    settings: {
                        'schema.polling.enable': false,
                    },
                }),
            ],
        });
        this.app.use(graphqlUploadExpress());
        await server.start();
        server.applyMiddleware({ app: this.app });
        await new Promise<void>((resolve) =>
            this.app.listen(
                { port: this.port, path: this.graphQLPath },
                resolve
            )
        );
        console.log(
            `🚀 Server ready at http://localhost:${this.port}${server.graphqlPath}`
        );
        console.log(
            `🚀Playground:  https://studio.apollographql.com/sandbox/explorer`
        );
    }
    private initializeMiddleware(): void {
        const devContentSecurityPolicy = {
            directives: {
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://cdn.jsdelivr.net',
                ],
                imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
            },
        };
        const IS_DEV = process.env.NODE_ENV !== 'production';
        this.app.use(
            helmet({
                contentSecurityPolicy: IS_DEV
                    ? devContentSecurityPolicy
                    : undefined,
            })
        );

        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
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
