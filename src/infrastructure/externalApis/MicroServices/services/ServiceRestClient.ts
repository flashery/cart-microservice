import { ArchiveService } from '../../../../app/domain/entities/ArchiveService';
export interface ServiceRestClient {
  getService(
    authToken: string,
    fixlersToken: string,
    serviceId: string
  ): Promise<ArchiveService>;
}
