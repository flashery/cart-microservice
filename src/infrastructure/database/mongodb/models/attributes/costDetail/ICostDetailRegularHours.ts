import { Schema } from 'mongoose';

export const ICostDetailRegularHours = new Schema({
  hourlyRegularHoursPricing: {
    regularHours: {
      firstHourValue: Number,
      additionalHoursValue: Number,
      additionalHoursType: String
    }
  },
  regularEstimatedHours: Number,
  extendedServiceCost: Number,
  isCustomQuoteJob: { type: Boolean, default: true }
});
