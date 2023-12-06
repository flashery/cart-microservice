import { Schema } from 'mongoose';

export const ICostDetailFixed = new Schema({
  quantity: Number,
  materialsTotal: Number,
  fixedPricing: {
    initialFee: Number,
    perQtyPricing: {
      perQtyPrice: Number,
      unitTypesSelected: [
        {
          sizeOptionsType: String,
          sizeOptionsSelected: String,
          unitCost: Number
        }
      ]
    }
  },
  extendedServiceCost: Number,
  extendedMaterialsCost: Number,
  isCustomQuoteJob: { type: Boolean, default: true }
});
