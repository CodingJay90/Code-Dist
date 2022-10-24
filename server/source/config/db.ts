import mongoose from 'mongoose';
import config from '@/config/config';

const RETRY_TIMEOUT = 30000;

mongoose.Promise = global.Promise;

const options: mongoose.ConnectOptions = {
  // autoReconnect: true,
  keepAlive: true,
  // reconnectInterval: RETRY_TIMEOUT,
  // reconnectTries: 10000,
  autoIndex: true,
  // poolSize: 50,
  // bufferMaxEntries: 0,
  // useNewUrlParser: true,
};

const connectDb = async function (): Promise<any> {
  return await mongoose
    .connect(config.server.mongoUrl, options)
    .then((db) => db)
    .catch((err) =>
      console.error('Mongoose connect(...) failed with err:', err)
    );
};

let isConnectedBefore = false;

connectDb();

mongoose.connection.on('error', () => {
  console.error('Could not connect to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.error('Lost MongoDB connection...');
  if (!isConnectedBefore) {
    setTimeout(async () => await connectDb(), RETRY_TIMEOUT);
  }
});
mongoose.connection.on('connected', () => {
  isConnectedBefore = true;
  console.info('Connection established to MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.info('Reconnected to MongoDB');
});

mongoose.set('autoIndex', true);
// mongoose.connection.dropDatabase(() => console.log('dropped'));
export default connectDb;
