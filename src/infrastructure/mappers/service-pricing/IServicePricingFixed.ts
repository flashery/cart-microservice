import { IPricingUnitType } from './IPricingUnitType';

export interface IServicePricingFixed {
  initialFee: number;
  perQtyPrice: number;
  pricingUnitTypes: IPricingUnitType[];
}
