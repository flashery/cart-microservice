export interface ICartJobAddressDTO {
  id: string;
  relTo: {
    type: string;
    attributes: {
      address1: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
}
