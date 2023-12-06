import { IServicePricingHourly } from './IServicePricingHourly';
import { IServicePricingFixed } from './IServicePricingFixed';

export interface IservicePricing {
  [key: string]: IServicePricingHourly | IServicePricingFixed;
}
