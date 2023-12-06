import { ICartJobAddressDTO } from '../../../mappers/ICartJobAddressDTO';

export interface AddressMS {
  getConsumerAddress(
    authToken: string,
    addressId: string
  ): Promise<ICartJobAddressDTO>;
}
