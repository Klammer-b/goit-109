import mongoose from 'mongoose';
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js';

export const initMongoDBConnection = async () => {
  try {
    const user = getEnv(ENV_VARS.MONGODB_USER);
    const password = getEnv(ENV_VARS.MONGODB_PASSWORD);
    const domain = getEnv(ENV_VARS.MONGODB_DOMAIN);
    const db = getEnv(ENV_VARS.MONGODB_DATABASE);
    const connectionURI = `mongodb+srv://${user}:${password}@${domain}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(connectionURI);

    console.log('Connection successfully established!');
  } catch (err) {
    console.error('Connection issues', err);
    process.exit(1);
  }
};
