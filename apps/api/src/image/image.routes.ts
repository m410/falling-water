import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { ImageEndpoints } from './image.endpoints';

export function createImageRoutes(controller: ImageEndpoints, storageDir: string): Router {
  const router = Router();

  // Configure multer storage for images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storageDir);
    },
    filename: (req, file, cb) => {
      const uniqueId = crypto.randomUUID();
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uniqueId}${ext}`);
    },
  });

  // Only allow image files
  const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`));
    }
  };

  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit for images
    },
  });

  router.post('/', upload.single('image'), controller.upload);
  router.post('/multiple', upload.array('images', 10), controller.uploadMultiple);

  return router;
}
