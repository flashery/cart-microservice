import { IConsumer } from '../../../mappers/IConsumer';

export interface ConsumerMS {
  getConsumer(authToken: string, addressId: string): Promise<IConsumer>;
}
