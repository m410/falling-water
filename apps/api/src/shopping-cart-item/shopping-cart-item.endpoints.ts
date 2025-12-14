import { ShoppingCartItemService } from './shopping-cart-item.repository';
import { Request, Response, NextFunction } from 'express';

export class ShoppingCartItemEndpoints {
  constructor(private shoppingCartItemService: ShoppingCartItemService) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.shoppingCartItemService.findAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const item = await this.shoppingCartItemService.findById(id);

      if (!item) {
        return res.status(404).json({ error: 'Shopping cart item not found' });
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.shoppingCartItemService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const item = await this.shoppingCartItemService.update(id, req.body);

      if (!item) {
        return res.status(404).json({ error: 'Shopping cart item not found' });
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.shoppingCartItemService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Shopping cart item not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
