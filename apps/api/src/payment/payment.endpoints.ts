import { PaymentService } from './payment.repository';
import { Request, Response, NextFunction } from 'express';

export class PaymentEndpoints {
  constructor(private paymentService: PaymentService) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.paymentService.findAll();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await this.paymentService.findById(id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.paymentService.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await this.paymentService.update(id, req.body);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.paymentService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
