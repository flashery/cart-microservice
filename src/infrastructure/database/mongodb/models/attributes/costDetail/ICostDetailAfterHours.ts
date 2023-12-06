import { Schema } from 'mongoose';

export const ICostDetailAfterHours = new Schema({
  hourlyRegularHoursPricing: {
    afterHours: {
      firstHourValue: Number,
      additionalHoursValue: Number,
      additionalHoursType: String
    }
  },
  regularEstimatedHours: Number,
  extendedServiceCost: Number,
  isCustomQuoteJob: { type: Boolean, default: true }
});
