/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction
} from 'express';

const errorHandler = (
  errorData: any,
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  console.error(errorData.stack);

  return res.status(errorData.status || 500).json({
    data: null,
    message: errorData.message ?? 'Internal Server Error'
  });
};

export default errorHandler;
