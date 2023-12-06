import axios from 'axios';
import dotenv from 'dotenv';
import { ServiceRestClient } from './ServiceRestClient';
import { CustomError } from '../../../../helpers/customeError';
import { externalAPI } from '../../../config/symbols';
import { ArchiveService } from '../../../../app/domain/entities/ArchiveService';
dotenv.config();

export class AxiosServiceRestClient implements ServiceRestClient {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = externalAPI.SERVICE_MS_URL ?? '';
  }

  public async getService(
    authToken: string,
    fixlersToken: string,
    serviceId: string
  ): Promise<ArchiveService> {
    try {
      const headers = authToken
        ? {
            Authorization: `${authToken}`,
            'x-fixlers-token': `${fixlersToken}`
          }
        : undefined;
      const response = await axios.get(
        `${this.baseURL}/api/services/${serviceId}`,
        {
          headers
        }
      );

      const service: ArchiveService = response.data.data;

      if (!service)
        throw new CustomError(
          'Service not found!',
          'AxiosServiceRestClient.getService',
          204
        );

      return service;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new CustomError(
        'Upstream Error: ' + error.message,
        'AxiosServiceRestClient.getService',
        503
      );
    }
  }
}
