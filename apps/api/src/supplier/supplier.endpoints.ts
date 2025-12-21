import { SupplierRepository } from './supplier.repository';
import { Request, Response, NextFunction } from 'express';

export class SupplierEndpoints {
  constructor(private supplierService: SupplierRepository) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const suppliers = await this.supplierService.findAll();
      res.json(suppliers);
    } catch (error) {
      next(error);
    }
  };

  findPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.supplierService.findPage(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await this.supplierService.findById(id);

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      res.json(supplier);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplier = await this.supplierService.create(req.body);
      res.status(201).json(supplier);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await this.supplierService.update(id, req.body);

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      res.json(supplier);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.supplierService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Product relationship endpoints
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplierId = parseInt(req.params.id);
      const supplier = await this.supplierService.findById(supplierId);

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      const products = await this.supplierService.findProductsBySupplier(supplierId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplierId = parseInt(req.params.id);
      const { product_id, cost_price, supplier_sku, is_preferred } = req.body;

      const supplier = await this.supplierService.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      const productSupplier = await this.supplierService.addProductToSupplier(
        supplierId,
        product_id,
        cost_price,
        supplier_sku,
        is_preferred
      );
      res.status(201).json(productSupplier);
    } catch (error) {
      next(error);
    }
  };

  removeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplierId = parseInt(req.params.id);
      const productId = parseInt(req.params.productId);

      const removed = await this.supplierService.removeProductFromSupplier(supplierId, productId);

      if (!removed) {
        return res.status(404).json({ error: 'Product-supplier relationship not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
