import { UserRepository } from "./user.repository";
import { EmailService } from "./user.email";
import { AddressRepository } from "../address/address.repository";
import {  Request, Response, NextFunction } from 'express';


export class UserEndpoints {
  constructor(
    private userService: UserRepository,
    private emailService: EmailService,
    private addressService: AddressRepository
  ) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  findPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.userService.findPage(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating user with data:', req.body);

    try {
      const { address, ...userData } = req.body;
      const user = await this.userService.create(userData);

      if (address) {
        await this.addressService.create({
          user_id: user.id,
          type: 'shipping',
          street: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        });
      }

      await this.emailService.sendWelcomeEmail(user.email, user.name);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.update(id, req.body);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.userService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const addresses = await this.addressService.findByUserId(userId);
      res.json(addresses);
    } catch (error) {
      next(error);
    }
  };
}
