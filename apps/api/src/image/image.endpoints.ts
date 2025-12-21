import { Request, Response, NextFunction } from 'express';

export class ImageEndpoints {
  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      const imageInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/storage/${req.file.filename}`,
      };

      res.status(201).json(imageInfo);
    } catch (error) {
      next(error);
    }
  };

  uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
      }

      const imagesInfo = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/storage/${file.filename}`,
      }));

      res.status(201).json(imagesInfo);
    } catch (error) {
      next(error);
    }
  };
}
