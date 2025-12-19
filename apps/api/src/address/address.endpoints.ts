import { AddressRepository } from './address.repository';
import { Request, Response, NextFunction } from 'express';

export class AddressEndpoints {
  constructor(private addressService: AddressRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.addressService.findAll();
      res.json(addresses);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.addressService.findById(id);

      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      res.json(address);
    } catch (error) {
      next(error);
    }
  };

  findByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.userId);
      const addresses = await this.addressService.findByUserId(userId);
      res.json(addresses);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.addressService.create(req.body);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.addressService.update(id, req.body);

      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      res.json(address);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.addressService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Address not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
