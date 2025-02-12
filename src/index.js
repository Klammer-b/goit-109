import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js';
import { initMongoDBConnection } from './db/initiMongoDbConnection.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

await createDirIfNotExists(TEMP_DIR_PATH);
await createDirIfNotExists(UPLOADS_DIR_PATH);
await initMongoDBConnection();
startServer();
