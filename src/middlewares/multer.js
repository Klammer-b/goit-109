import multer from 'multer';
import { TEMP_DIR_PATH } from '../constants/path.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();

    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
