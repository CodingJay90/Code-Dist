import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: PORT,
    mongoUrl: process.env.MONGO_URL || '',
};

const config = {
    server: SERVER,
};

export default config;
