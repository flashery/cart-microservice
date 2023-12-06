//import axios, { AxiosRequestConfig } from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';
dotenv.config();

// const authenticate = (
//   req: ExpressRequest,
//   res: ExpressResponse,
//   next: NextFunction
// ) => {
//   const config: AxiosRequestConfig = {
//     method: 'post',
//     url: `${process.env.AUTHENTICATOR_URL}/authenticate`,
//     headers: {
//       Authorization: req.headers.authorization,
//       ['x-fixlers-token']: req.headers['x-fixlers-token']
//     },
//     responseType: 'json'
//   };
//   axios(config)
//     .then((response) => {
//       if (response.data.message === 'Authorized') {
//         next();
//       }
//     })
//     .catch((error) => {
//       res.status(401).json({ ...error.response.data });
//     });
// };

// export default authenticate;
const authenticate = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const serviceToken = req.headers.authorization?.split(' ')[1];
  if (!serviceToken) {
    return res.status(401).json({ message: 'Unauthorized. Missing Token' });
  }

  try {
    const decoded = jwt.verify(serviceToken, process.env.SECRET_KEY as string);
    if (decoded === '') {
      return res
        .status(401)
        .json({ message: 'Unauthorized here. Invalid Token' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication Service Error' });
  }
};

export default authenticate;
