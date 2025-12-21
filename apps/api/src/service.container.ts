import { UserRepository } from './usr/user.repository';
import { EmailService } from './usr/user.email';
import { ProductRepository } from './product/product.repository';
import { AddressRepository } from './address/address.repository';
import { CategoryRepository } from './category/category.repository';
import { OrderRepository } from './order/order.repository';
import { OrderItemRepository } from './order-item/order-item.repository';
import { PaymentRepository } from './payment/payment.repository';
import { ReviewRepository } from './review/review.repository';
import { ShoppingCartItemRepository } from './shopping-cart-item/shopping-cart-item.repository';
import { SystemRepository } from './system/system.repository';
import { FileRepository } from './file/file.repository';
import { SupplierRepository } from './supplier/supplier.repository';
import { Pool } from 'pg';
import * as path from 'path';

export interface ServiceContainer {
  userService: UserRepository;
  emailService: EmailService;
  productService: ProductRepository;
  addressService: AddressRepository;
  categoryService: CategoryRepository;
  orderService: OrderRepository;
  orderItemService: OrderItemRepository;
  paymentService: PaymentRepository;
  reviewService: ReviewRepository;
  shoppingCartItemService: ShoppingCartItemRepository;
  systemService: SystemRepository;
  fileService: FileRepository;
  supplierService: SupplierRepository;
  storageDir: string;
  db: Pool;
}

export function createContainer(db: Pool): ServiceContainer {
  const emailService = new EmailService();
  const userService = new UserRepository(db);
  const productService = new ProductRepository(db);
  const addressService = new AddressRepository(db);
  const categoryService = new CategoryRepository(db);
  const orderService = new OrderRepository(db);
  const orderItemService = new OrderItemRepository(db);
  const paymentService = new PaymentRepository(db);
  const reviewService = new ReviewRepository(db);
  const shoppingCartItemService = new ShoppingCartItemRepository(db);
  const systemService = new SystemRepository(db);
  const supplierService = new SupplierRepository(db);

  // File storage - resolve path relative to project root
  const storageDir = path.resolve(process.cwd(), 'storage');
  const fileService = new FileRepository(storageDir);

  return {
    userService,
    emailService,
    productService,
    addressService,
    categoryService,
    orderService,
    orderItemService,
    paymentService,
    reviewService,
    shoppingCartItemService,
    systemService,
    fileService,
    supplierService,
    storageDir,
    db,
  };
}
