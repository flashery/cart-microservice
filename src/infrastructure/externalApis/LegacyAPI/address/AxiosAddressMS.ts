import axios from 'axios';
import { AddressMS } from './AddressMS';
import { externalAPI } from '../../../config/symbols';
import { ICartJobAddressDTO } from '../../../mappers/ICartJobAddressDTO';
import { CustomError } from '../../../../helpers/customeError';

export class AxiosAddressMS implements AddressMS {
  private readonly baseURL: string;

  private readonly getAddressEndpoint: string;

  constructor() {
    this.baseURL = externalAPI.LEGACY_API_URL ?? '';
    this.getAddressEndpoint = externalAPI.GET_ADDRESS_ENDPOINT ?? '';
  }

  public async getConsumerAddress(
    authToken: string,
    addressId: string
  ): Promise<ICartJobAddressDTO> {
    try {
      const headers = authToken ? { Authorization: `${authToken}` } : undefined;
      const response = await axios.get(
        `${this.baseURL}${this.getAddressEndpoint}/${addressId}`,
        {
          headers
        }
      );
      const responseData = response.data.data;

      // data manipulation before response
      const jobAddress = {
        id: responseData._id,
        relTo: {
          type: 'consumerAddress',
          attributes: {
            address1: responseData.address,
            city: responseData.city,
            state: responseData.state,
            zipCode: responseData.zipCode
          }
        }
      };
      return jobAddress;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new CustomError(
        'Upstream Error: ' + error.message,
        'AxiosAddressMS.getConsumerAddress',
        503
      );
    }
  }
}
