import axios from 'axios';
import { ConsumerMS } from './ConsumerMS';
import { externalAPI } from '../../../config/symbols';
import { IConsumer } from '../../../mappers/IConsumer';
import { CustomError } from '../../../../helpers/customeError';

export class AxiosConsumerMS implements ConsumerMS {
  private readonly baseURL: string;

  private readonly getConsumerEndpoint: string;

  constructor() {
    this.baseURL = externalAPI.LEGACY_API_URL ?? '';
    this.getConsumerEndpoint = externalAPI.GET_CONSUMER_ENDPOINT ?? '';
  }

  public async getConsumer(
    authToken: string,
    consumerId: string
  ): Promise<IConsumer> {
    try {
      const headers = authToken ? { Authorization: `${authToken}` } : undefined;
      const response = await axios.get(
        `${this.baseURL}${this.getConsumerEndpoint}/${consumerId}`,
        {
          headers
        }
      );
      const responseData = response.data.data;

      // data manipulation before response
      const consumer: IConsumer = {
        id: responseData._id,
        relTo: {
          id: responseData._id,
          type: 'consumerusers',
          attributes: {
            fullName: responseData.fullName,
            profilePic: responseData.profilePic
          }
        }
      };

      return consumer;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new CustomError(
        'Upstream Error: ' + error.message,
        'AxiosConsumerMS.getConsumer',
        503
      );
    }
  }
}
