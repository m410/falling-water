import { CategoryRepository } from './category.repository';
import { Request, Response, NextFunction } from 'express';

export class CategoryEndpoints {
  constructor(private categoryService: CategoryRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.findById(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.update(id, req.body);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.categoryService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
