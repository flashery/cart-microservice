import { Schema } from 'mongoose';

export const PreferredTiming = new Schema({
  preferredWeekDays: [String],
  preferredTimeSlots: {
    from: Number,
    to: Number,
    title: String
  }
});
