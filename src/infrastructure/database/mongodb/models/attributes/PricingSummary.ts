import { Schema } from 'mongoose';

export const PricingSummary = new Schema({
  materialCostDetail: {
    totalMaterialCost: Number,
    fixlersMaterialMarkupPct: Number,
    fixlersMaterialMarkupFee: Number
  },
  serviceCostDetail: {
    totalServiceCost: Number,
    fixlersServiceMarkupPct: Number,
    fixlersServiceMarkupFee: Number
  },
  totalCost: Number,
  totalFixlersMarkupFee: Number,
  subTotal: Number,
  taxPct: Number,
  taxAmount: Number,
  grandTotal: Number
});
