import { OrderService } from './order.repository';
import { Request, Response, NextFunction } from 'express';

export class OrderEndpoints {
  constructor(private orderService: OrderService) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.findAll();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderService.findById(id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderService.update(id, req.body);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.orderService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
