import { UserService } from './usr/user.repository';
import { EmailService } from './usr/user.email';
import { ProductService } from './product/product.repository';
import { AddressService } from './address/address.repository';
import { CategoryService } from './category/category.repository';
import { OrderService } from './order/order.repository';
import { OrderItemService } from './order-item/order-item.repository';
import { PaymentService } from './payment/payment.repository';
import { ReviewService } from './review/review.repository';
import { ShoppingCartItemService } from './shopping-cart-item/shopping-cart-item.repository';
import { Pool } from 'pg';

export interface ServiceContainer {
  userService: UserService;
  emailService: EmailService;
  productService: ProductService;
  addressService: AddressService;
  categoryService: CategoryService;
  orderService: OrderService;
  orderItemService: OrderItemService;
  paymentService: PaymentService;
  reviewService: ReviewService;
  shoppingCartItemService: ShoppingCartItemService;
  db: Pool;
}

export function createContainer(db: Pool): ServiceContainer {
  const emailService = new EmailService();
  const userService = new UserService(db);
  const productService = new ProductService(db);
  const addressService = new AddressService(db);
  const categoryService = new CategoryService(db);
  const orderService = new OrderService(db);
  const orderItemService = new OrderItemService(db);
  const paymentService = new PaymentService(db);
  const reviewService = new ReviewService(db);
  const shoppingCartItemService = new ShoppingCartItemService(db);

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
    db,
  };
}
