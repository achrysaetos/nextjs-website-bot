import { NextApiHandler, NextApiRequest } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false
  }
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), '/public/user_files');
    options.filename = (name: any, ext: any, path: { originalFilename: string; }, form: any) => {
      return path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const directory = path.join(process.cwd() + '/public', '/user_files');
    for (const file of await fs.readdir(directory)) {
      await fs.unlink(path.join(directory, file));
    }
    await fs.readdir(directory);
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + '/public', '/user_files'));
  }
  await readFile(req, true);
  res.json({ done: 'ok' });
};

export default handler;
