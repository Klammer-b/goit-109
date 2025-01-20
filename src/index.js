import { initMongoDBConnection } from './db/initiMongoDbConnection.js';
import { startServer } from './server.js';

await initMongoDBConnection();
startServer();
