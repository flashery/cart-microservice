import { ArchiveService } from './ArchiveService';
import { CartService } from './CartService';
import { PricingSummary } from './PricingSummary';

export class Cart {
  constructor(
    public id: string,
    public attributes: {
      archivedServiceObjects: ArchiveService[];
      cartServices: CartService[];
      pricingSummary: PricingSummary;
      preferredTiming: {};
    },
    public relationships: {
      belongsToConsumer: {};
      jobAddress: {};
    },
    public properties: {
      createdService: string;
      createdBy: string;
      createdDate: string;
      modifiedService: string;
      modifiedBy: string;
      modifiedDate: string;
      __v: number;
      generation: number;
    },
    public status: string
  ) {}
}
