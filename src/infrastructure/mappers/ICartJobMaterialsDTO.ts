export interface ICartJobMaterialsDTO {
  _id: string | undefined;
  isRequired: boolean;
  product: {
    productId: string;
    brand: string;
    title: string;
    description: string;
    price: number;
    facets: object[];
    media: {
      images: object[];
      videos: object[];
      voicenotes: object[];
    };
  };
  status: string;
  consumerApproval: {
    isApprovedByConsumer: boolean;
    rejectedReasonDescription: string;
    rejectedReason: string;
  };
  totalSummary: {
    quantity: number;
    extendedPrice: number;
  };
  addedBy: string;
  isProvidedByTechnician: boolean;
}
