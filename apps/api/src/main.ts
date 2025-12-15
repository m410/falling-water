import express, { Express, Request, Response, NextFunction } from 'express';
import { ServiceContainer } from './service.container';
import { UserEndpoints } from './usr/user.endpoints';
import { createUserRoutes } from './usr/user.routes';
import { ProductEndpoints } from './product/product.endpoints';
import { createProductRoutes } from './product/product.routes';
import { AddressEndpoints } from './address/address.endpoints';
import { createAddressRoutes } from './address/address.routes';
import { CategoryEndpoints } from './category/category.endpoints';
import { createCategoryRoutes } from './category/category.routes';
import { OrderEndpoints } from './order/order.endpoints';
import { createOrderRoutes } from './order/order.routes';
import { OrderItemEndpoints } from './order-item/order-item.endpoints';
import { createOrderItemRoutes } from './order-item/order-item.routes';
import { PaymentEndpoints } from './payment/payment.endpoints';
import { createPaymentRoutes } from './payment/payment.routes';
import { ReviewEndpoints } from './review/review.endpoints';
import { createReviewRoutes } from './review/review.routes';
import { ShoppingCartItemEndpoints } from './shopping-cart-item/shopping-cart-item.endpoints';
import { createShoppingCartItemRoutes } from './shopping-cart-item/shopping-cart-item.routes';
import { createContainer } from './service.container';
import { AuthEndpoints } from './auth/auth.endpoints';
import { createAuthRoutes } from './auth/auth.routes';
import { pool } from './db/db';

// ============================================
// APPLICATION SETUP
// ============================================

export function createApp(container: ServiceContainer): Express {
  const app = express();

  app.use(express.json());
  app.locals.container = container;

  app.use('/api', createAuthRoutes(new AuthEndpoints(
    container.userService)));
  
  app.use('/api/users', createUserRoutes(new UserEndpoints(
    container.userService,
    container.emailService
  )));
  app.use('/api/products', createProductRoutes(new ProductEndpoints(
    container.productService
  )));
  app.use('/api/addresses', createAddressRoutes(new AddressEndpoints(
    container.addressService
  )));
  app.use('/api/categories', createCategoryRoutes(new CategoryEndpoints(
    container.categoryService
  )));
  app.use('/api/orders', createOrderRoutes(new OrderEndpoints(
    container.orderService
  )));
  app.use('/api/order-items', createOrderItemRoutes(new OrderItemEndpoints(
    container.orderItemService
  )));
  app.use('/api/payments', createPaymentRoutes(new PaymentEndpoints(
    container.paymentService
  )));
  app.use('/api/reviews', createReviewRoutes(new ReviewEndpoints(
    container.reviewService
  )));
  app.use('/api/shopping-cart-items', createShoppingCartItemRoutes(new ShoppingCartItemEndpoints(
    container.shoppingCartItemService
  )));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

// ============================================
// SERVER START
// ============================================

async function startServer() {
  const container = createContainer(pool);
  const app = createApp(container);
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
