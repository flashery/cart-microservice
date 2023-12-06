import { IHourlyRate } from './IHourlyRate';

export interface IServicePricingHourly {
  regularHours: IHourlyRate;
  afterHours: IHourlyRate;
  estimatedHours: number;
  isFreeEstimate: boolean;
}
