import * as fs from 'fs';
import * as path from 'path';
import { StoredFile } from './stored-file';

export class FileRepository {
  private readonly storageDir: string;

  constructor(storageDir: string) {
    this.storageDir = storageDir;
    this.ensureStorageDir();
  }

  private ensureStorageDir(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.storageDir, filename);
  }

  fileExists(filename: string): boolean {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFileInfo(filename: string): StoredFile | null {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);

    return {
      id: filename,
      originalName: filename,
      filename: filename,
      mimetype: this.getMimeType(filename),
      size: stats.size,
      path: filePath,
      createdAt: stats.birthtime,
    };
  }

  deleteFile(filename: string): boolean {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    fs.unlinkSync(filePath);
    return true;
  }

  listFiles(): StoredFile[] {
    const files = fs.readdirSync(this.storageDir);

    return files
      .filter(file => file !== '.gitkeep')
      .map(filename => this.getFileInfo(filename))
      .filter((file): file is StoredFile => file !== null);
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.zip': 'application/zip',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
