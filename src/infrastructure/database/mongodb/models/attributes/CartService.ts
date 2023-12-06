import { Schema } from 'mongoose';
import { ICostDetailAfterHours } from './costDetail/ICostDetailAfterHours';
import { ICostDetailRegularHours } from './costDetail/ICostDetailRegularHours';
import { ICostDetailFixed } from './costDetail/ICostDetailFixed';

export const CartService = new Schema({
  id: String,
  serviceName: String,
  description: String,
  quantity: { type: Number, default: 2 },
  answers: [
    {
      questionId: String,
      answerId: String,
      userAnswer: String,
      question: String
    }
  ],
  consumerNote: {
    content: String,
    media: {
      images: [],
      videos: [],
      voicenotes: []
    }
  },
  costDetail: {
    type: Schema.Types.Mixed,
    enum: [ICostDetailAfterHours, ICostDetailRegularHours, ICostDetailFixed]
  },
  jobMaterials: [
    {
      isRequired: Boolean,
      product: {
        brand: String,
        title: String,
        description: String,
        link: String,
        price: Number,
        facets: [],
        media: {
          images: [],
          videos: [],
          voicenotes: []
        }
      },
      status: {
        type: String,
        enum: ['Waiting for Approval', 'Approved', 'Rejected'],
        default: ''
      },
      consumerApproval: {
        isApprovedByConsumer: Boolean,
        rejectedReasonDescription: String,
        rejectedReason: String
      },
      totalSummary: {
        quantity: Number,
        extendedPrice: Number
      },
      addedBy: {
        type: String,
        enum: ['admin', 'consumer', 'technician'],
        default: ''
      },
      isProvidedByTechnician: Boolean
    }
  ],
  preferredTiming: {
    preferredWeekDays: {
      type: [String]
    },
    preferredTimeSlots: [
      {
        date: { type: String },
        from: { type: String },
        to: { type: String }
      }
    ]
  }
});
