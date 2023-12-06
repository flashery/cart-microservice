export interface ICartRelationshipDTO {
  jobAddress: [
    {
      id: string;
      relTo: {
        id: string;
        type: string;
        data: {
          address1: string;
          city: string;
          state: string;
          zipCode: string;
        };
      };
    }
  ];
}
