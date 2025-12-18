import { ReviewRepository } from './review.repository';
import { Request, Response, NextFunction } from 'express';

export class ReviewEndpoints {
  constructor(private reviewService: ReviewRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewService.findAll();
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  };

  findPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.reviewService.findPage(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const review = await this.reviewService.findById(id);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.create(req.body);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const review = await this.reviewService.update(id, req.body);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.reviewService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
