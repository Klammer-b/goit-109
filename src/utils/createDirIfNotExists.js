import fs from 'fs/promises';

export const createDirIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch (err) {
    console.log(err);

    if (err.code === 'ENOENT') {
      await fs.mkdir(path);
    }
  }
};
