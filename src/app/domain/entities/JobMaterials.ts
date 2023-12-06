import { Media } from './Media';
export class JobMaterials {
  constructor(
    public _id: string | undefined,
    public isRequired: boolean,
    public product: {
      brand: string;
      title: string;
      description: string;
      link: string;
      price: number;
      facets: object[];
      media: {
        images: Media[];
        videos: Media[];
        voicenotes: Media[];
      };
    },
    public status: string,
    public consumerApproval: {
      isApprovedByConsumer: boolean;
      rejectedReasonDescription: string;
      rejectedReason: string;
    },
    public totalSummary: {
      quantity: number;
      extendedPrice: number;
    },
    public addedBy: string,
    public isProvidedByTechnician: boolean
  ) {}
}
