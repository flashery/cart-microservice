import { ITimeSlot } from './ITimeSlot';

export interface IPreferredTiming {
  preferredWeekDays: string[];
  preferredTimeSlots: ITimeSlot[];
}
