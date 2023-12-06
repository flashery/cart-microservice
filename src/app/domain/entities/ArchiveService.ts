interface FixedService {
  displayPrice: {
    lowPrice: string;
    highPrice: string;
  };
  fixed: {
    initialFee: number;
    perQtyPrice: number;
    pricingUnitTypes: [];
  };
}

interface HourlyService {
  displayPrice: {
    lowPrice: string;
    highPrice: string;
  };
  hourly: {
    regularHours: {
      firstHourValue: number;
      additionalHoursValue: number;
      additionalHoursType: string;
    };
    afterHours: {
      firstHourValue: number;
      additionalHoursValue: number;
      additionalHoursType: string;
    };
    estimatedHours: number;
    isFreeEstimate: boolean;
  };
}

export class ArchiveService {
  constructor(
    public id: string,
    public serviceName: string,
    public description: string,
    public pricing: FixedService | HourlyService,
    public category: [
      {
        categoryName: string;
        description: string;
        thumbnail: string;
        ancestor: [
          {
            name: string;
            path: string;
          },
          {
            name: string;
            path: string;
          }
        ];
        slug: string;
        path: string;
      }
    ]
  ) {}
}
