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

export interface IArchiveServiceObject {
  id: string;
  category: [
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
  ];
  description: string;
  quantity: {
    prompt: string;
    minimum: number;
    maximum: number;
  };
  pricing: FixedService | HourlyService;
  facets: {};
  questions: [];
  jobMaterialQuestions: [];
  subServices: [];
  settings: {
    consumerNotesPrompt: string;
    mediaUploadPrompt: string;
    isConsumerNotesRequired: boolean;
    isMediaPhotoRequired: boolean;
    isMediaVideoRequired: boolean;
    isMediaVoicenoteRequired: boolean;
    minimumMediaTypesRequired: number;
  };
}
