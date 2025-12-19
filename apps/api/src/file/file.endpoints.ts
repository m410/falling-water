import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import { FileRepository } from './file.repository';

export class FileEndpoints {
  constructor(private fileService: FileRepository) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileInfo = {
        id: req.file.filename,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/api/files/${req.file.filename}`,
      };

      res.status(201).json(fileInfo);
    } catch (error) {
      next(error);
    }
  };

  uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const filesInfo = req.files.map((file) => ({
        id: file.filename,
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: `/api/files/${file.filename}`,
      }));

      res.status(201).json(filesInfo);
    } catch (error) {
      next(error);
    }
  };

  getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }

      const filePath = this.fileService.getFilePath(filename);

      if (!this.fileService.fileExists(filename)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const fileInfo = this.fileService.getFileInfo(filename);
      if (fileInfo) {
        res.setHeader('Content-Type', fileInfo.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${fileInfo.originalName}"`);
      }

      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  };

  downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }

      const filePath = this.fileService.getFilePath(filename);

      if (!this.fileService.fileExists(filename)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const fileInfo = this.fileService.getFileInfo(filename);
      const downloadName = fileInfo?.originalName || filename;

      res.download(filePath, downloadName);
    } catch (error) {
      next(error);
    }
  };

  getFileInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }

      const fileInfo = this.fileService.getFileInfo(filename);

      if (!fileInfo) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json({
        ...fileInfo,
        url: `/api/files/${filename}`,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }

      const deleted = this.fileService.deleteFile(filename);

      if (!deleted) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = this.fileService.listFiles();
      const filesWithUrls = files.map(file => ({
        ...file,
        url: `/api/files/${file.filename}`,
      }));

      res.json(filesWithUrls);
    } catch (error) {
      next(error);
    }
  };
}
