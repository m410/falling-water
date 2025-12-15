import { OrderItemRepository } from './order-item.repository';
import { Request, Response, NextFunction } from 'express';

export class OrderItemEndpoints {
  constructor(private orderItemService: OrderItemRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItems = await this.orderItemService.findAll();
      res.json(orderItems);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const orderItem = await this.orderItemService.findById(id);

      if (!orderItem) {
        return res.status(404).json({ error: 'Order item not found' });
      }

      res.json(orderItem);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItem = await this.orderItemService.create(req.body);
      res.status(201).json(orderItem);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const orderItem = await this.orderItemService.update(id, req.body);

      if (!orderItem) {
        return res.status(404).json({ error: 'Order item not found' });
      }

      res.json(orderItem);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.orderItemService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Order item not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
