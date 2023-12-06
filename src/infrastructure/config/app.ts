import dotenv from 'dotenv';
import express, { Application } from 'express';
import { CartRoutes } from '../../interfaces/routes/CartRoutes';
import middleware from './middleware';
import errorHandler from '../../helpers/errorHandler';

dotenv.config();

export const createApp = (cartRoutes: CartRoutes): Application => {
  const app = express();

  const port = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Add authenticate middleware to all routes that need protection
  app.use(middleware);

  // Routes
  const routes = cartRoutes.getRoutes();
  app.use('/api', routes);

  // Error handler
  app.use(errorHandler);

  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${port}`);
    });
  }
  return app;
};
