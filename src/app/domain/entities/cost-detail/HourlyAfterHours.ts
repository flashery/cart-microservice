export class HourlyAfterHours {
  constructor(
    public hourlyRegularHoursPricing: {
      afterHours: {
        firstHourValue: number;
        additionalHoursValue: number;
        additionalHoursType: string;
      };
    },
    public regularEstimatedHours: number,
    public extendedServiceCost: number,
    public fixlersServiceMarkupPct?: number,
    public fixlersMaterialMarkupPct?: number,
    public isCustomQuoteJob?: boolean
  ) {}
}
