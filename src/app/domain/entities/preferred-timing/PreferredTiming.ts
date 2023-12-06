import { TimeSlot } from './TimeSlot';

export class PreferredTiming {
  constructor(
    public preferredWeekDays: string[],
    public preferredTimeSlots: TimeSlot[]
  ) {}
}
