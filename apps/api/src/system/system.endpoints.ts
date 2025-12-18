import { SystemRepository } from './system.repository';
import { Request, Response, NextFunction } from 'express';

export class SystemEndpoints {
  constructor(private systemService: SystemRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systems = await this.systemService.findAll();
      res.json(systems);
    } catch (error) {
      next(error);
    }
  };

  findPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.systemService.findPage(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const system = await this.systemService.findById(id);

      if (!system) {
        return res.status(404).json({ error: 'System not found' });
      }

      res.json(system);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const system = await this.systemService.create(req.body);
      res.status(201).json(system);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const system = await this.systemService.update(id, req.body);

      if (!system) {
        return res.status(404).json({ error: 'System not found' });
      }

      res.json(system);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.systemService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'System not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
