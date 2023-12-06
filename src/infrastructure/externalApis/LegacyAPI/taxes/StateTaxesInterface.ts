import { IStateTax } from '../../../mappers/IStateTax';

export interface StateTaxesInterface {
  getStateTax(authToken: string, stateName: string): Promise<IStateTax>;
}
