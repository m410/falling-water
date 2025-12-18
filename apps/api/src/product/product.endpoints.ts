import { ProductRepository } from './product.repository';
import { Request, Response, NextFunction } from 'express';

export class ProductEndpoints {
  constructor(private productService: ProductRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.findAll();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  findPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.productService.findPage(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.findById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.update(id, req.body);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.productService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
