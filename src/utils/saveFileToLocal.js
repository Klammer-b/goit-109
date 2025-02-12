import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR_PATH } from '../constants/path.js';
import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';

export const saveFileToLocal = async (photo) => {
  await fs.rename(photo.path, path.join(UPLOADS_DIR_PATH, photo.filename));

  return `${getEnv(ENV_VARS.BACKEND_DOMAIN)}/uploads/${photo.filename}`;
};
