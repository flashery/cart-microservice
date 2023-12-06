export class JobAddress {
  constructor(
    public id: string,
    public relTo: {
      attributes: {
        type: string;
        address1: string;
        city: string;
        state: string;
        zipCode: string;
      };
    }
  ) {}
}
