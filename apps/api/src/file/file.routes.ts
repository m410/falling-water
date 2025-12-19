import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileEndpoints } from './file.endpoints';

export function createFileRoutes(controller: FileEndpoints, storageDir: string): Router {
  const router = Router();

  // Configure multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storageDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with original extension
      const uniqueId = crypto.randomUUID();
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueId}${ext}`);
    },
  });

  // File filter to limit allowed file types
  const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/json',
      'application/xml',
      'application/zip',
      'video/mp4',
      'audio/mpeg',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
  });

  // Routes
  router.post('/', upload.single('file'), controller.upload);
  router.post('/multiple', upload.array('files', 10), controller.uploadMultiple);
  router.get('/', controller.listFiles);
  router.get('/:filename', controller.getFile);
  router.get('/:filename/info', controller.getFileInfo);
  router.get('/:filename/download', controller.downloadFile);
  router.delete('/:filename', controller.deleteFile);

  return router;
}
