import path from 'node:path';

export const TEMPLATES_DIR_PATH = path.join(process.cwd(), 'src', 'templates');
export const TEMP_DIR_PATH = path.join(process.cwd(), 'temp');
export const UPLOADS_DIR_PATH = path.join(process.cwd(), 'uploads');
export const SWAGGER_JSON_PATH = path.join(
  process.cwd(),
  'docs',
  'swagger.json',
);
