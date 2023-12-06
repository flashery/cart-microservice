import axios from 'axios';
import { StateTaxesInterface } from './StateTaxesInterface';
import { externalAPI } from '../../../config/symbols';
import { IStateTax } from '../../../mappers/IStateTax';

export class AxiosTaxes implements StateTaxesInterface {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = externalAPI.LEGACY_API_URL ?? '';
  }

  public async getStateTax(
    authToken: string,
    stateName: string
  ): Promise<IStateTax> {
    const headers = authToken ? { Authorization: `${authToken}` } : undefined;
    const response = await axios.post(`${this.baseURL}/api/v1/state/`, {
      headers
    });
    const responseData = response.data.data;

    // data manipulation before response
    return responseData[0].stateArray.find(
      (x: any) => x.stateName === stateName
    );
  }
}
