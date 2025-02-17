import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/env.js';
import { getEnv } from './getEnv.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToLocal } from './saveFileToLocal.js';

export const saveFile = async (file) => {
  const strategy = getEnv(ENV_VARS.SAVE_FILE_STRATEGY);

  if (strategy === 'cloudinary') {
    return await saveFileToCloudinary(file);
  }
  if (strategy === 'local') {
    return await saveFileToLocal(file);
  }

  throw createHttpError(500, 'No file storage trategy set');
};
