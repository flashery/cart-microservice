export interface IConsumer {
  id: string;
  relTo: {
    id: string;
    type: string;
    attributes: {
      fullName: string;
      profilePic: string;
    };
  };
}
