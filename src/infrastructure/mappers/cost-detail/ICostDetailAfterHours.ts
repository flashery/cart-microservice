export interface ICostDetailAfterHours {
  hourlyRegularHoursPricing: {
    afterHours: {
      firstHourValue: number;
      additionalHoursValue: number;
      additionalHoursType: string;
    };
  };
  regularEstimatedHours: number;
  extendedServiceCost: number;
  fixlersServiceMarkupPct?: number;
  fixlersMaterialMarkupPct?: number;
  isCustomQuoteJob?: boolean;
}
