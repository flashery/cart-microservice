import { ICartServiceDTO } from './ICartServiceDTO';
export interface ICartDTO {
  id: string;
  attributes: {
    archivedServiceObjects: [
      {
        id: string;
        also: object;
      }
    ];
    cartServices: ICartServiceDTO[];
    pricingSummary: {
      materialCostDetail: {
        totalMaterialCost: number;
        fixlersMaterialMarkupPct: number;
        fixlersMaterialMarkupFee: number;
      };
      serviceCostDetail: {
        totalServiceCost: number;
        fixlersServiceMarkupPct: number;
        fixlersServiceMarkupFee: number;
        totalCost: number;
        totalFixlersMarkupFee: number;
        subTotal: number;
        taxPct: number;
        taxAmount: number;
        grandTotal: number;
      };
    };
    preferredTiming: object;
  };
  relationships: {
    belongsToConsumer: {};
    jobAddress: {};
  };
  properties: {
    createdService: string;
    createdBy: string;
    createdDate: string;
    modifiedService: string;
    modifiedBy: string;
    modifiedDate: string;
    __v: number;
    generation: number;
  };
  status: string;
}
