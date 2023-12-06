import { UnitTypeSelected } from './UnitTypeSelected';

export class Fixed {
  constructor(
    public quantity: number,
    public materialsTotal: number,
    public fixedPricing: {
      initialFee: number;
      perQtyPricing: {
        perQtyPrice: number;
        unitTypesSelected: UnitTypeSelected[];
      };
    },
    public extendedServiceCost: number,
    public extendedMaterialsCost: number,
    public fixlersServiceMarkupPct?: number,
    public fixlersMaterialMarkupPct?: number,
    public isCustomQuoteJob?: boolean
  ) {}
}
