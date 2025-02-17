import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

cloudinary.config({
  cloud_name: getEnv(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: getEnv(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: getEnv(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const res = await cloudinary.v2.uploader.upload(file.path);
    return res.secure_url;
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Failed to upload an image to cloudinary');
  } finally {
    await fs.unlink(file.path);
  }
};
