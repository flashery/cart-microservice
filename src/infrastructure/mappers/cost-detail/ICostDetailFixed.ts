import { IUnitTypesSelected } from './IUnitTypesSelected';

export interface ICostDetailFixed {
  quantity: number;
  materialsTotal: number;
  fixedPricing: {
    initialFee: number;
    perQtyPricing: {
      perQtyPrice: number;
      unitTypesSelected: IUnitTypesSelected[];
    };
  };
  extendedServiceCost: number;
  extendedMaterialsCost: number;
  fixlersServiceMarkupPct?: number;
  fixlersMaterialMarkupPct?: number;
  isCustomQuoteJob?: boolean;
}
