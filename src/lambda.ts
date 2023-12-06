import dotenv from 'dotenv';
import { CartRepository } from './app/domain/repositories/CartRepository';
import { CartUseCases } from './app/use_cases/CartUseCases';
import { createApp } from './infrastructure/config/app';
import { connectToDatabase } from './infrastructure/config/db';
import serverlessHttp from 'serverless-http';
import { CartDataMapper } from './infrastructure/mappers/CartDataMapper';
import { CartController } from './interfaces/controllers/CartController';
import { CartRoutes } from './interfaces/routes/CartRoutes';
import { Application } from 'express';

dotenv.config();

const cartMapper = new CartDataMapper();
const cartRepository = new CartRepository(cartMapper);
const cartUseCases = new CartUseCases(cartRepository);
const cartController = new CartController(cartUseCases);
const cartRoutes = new CartRoutes(cartController);

const app: Application = createApp(cartRoutes);

const handler = serverlessHttp(app);

const connectionString =
  process.env.MONGODB_CONNECTION_STRING ||
  process.env.MONGODB_CONNECTION_STRING_DEV;
// Connect to the database
connectToDatabase(connectionString || '');

export { handler };
