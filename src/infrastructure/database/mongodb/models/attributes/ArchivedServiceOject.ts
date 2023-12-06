import { Schema } from 'mongoose';

const FixedPricing = new Schema({
  initialFee: Number,
  perQtyPrice: Number,
  pricingUnitTypes: []
});

const HourlyPricing = new Schema({
  regularHours: {
    firstHourValue: Number,
    additionalHoursValue: Number,
    additionalHoursType: String
  },
  afterHours: {
    firstHourValue: Number,
    additionalHoursValue: Number,
    additionalHoursType: String
  },
  estimatedHours: Number,
  isFreeEstimate: Boolean
});

export const ArchivedServiceOject = new Schema({
  id: String,
  serviceName: String,
  description: String,
  category: [
    {
      categoryName: String,
      description: String,
      thumbnail: String,
      ancestor: [
        {
          name: String,
          path: String
        },
        {
          name: String,
          path: String
        }
      ],
      slug: String,
      path: String
    }
  ],
  quantity: {
    prompt: String,
    minimum: Number,
    maximum: Number
  },
  pricing: {
    displayPrice: {
      lowPrice: String,
      highPrice: String
    },
    fixed: {
      type: FixedPricing,
      default: null
    },
    hourly: {
      type: HourlyPricing,
      default: null
    },
    isCustomQuoteJob: Boolean
  },
  facets: {},
  questions: [],
  jobMaterialQuestions: [],
  subServices: [],
  settings: {
    consumerNotesPrompt: String,
    mediaUploadPrompt: String,
    isConsumerNotesRequired: Boolean,
    isMediaPhotoRequired: Boolean,
    isMediaVideoRequired: Boolean,
    isMediaVoicenoteRequired: Boolean,
    minimumMediaTypesRequired: Number
  },
  expertise: [
    {
      name: String
    }
  ]
});
