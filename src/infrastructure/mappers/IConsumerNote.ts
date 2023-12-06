export interface IConsumerNote {
  content: string;
  media: {
    images: [
      {
        url: string;
        thumbnail: string;
        description: string;
        type: string;
      }
    ];
    videos: [
      {
        url: string;
        thumbnail: string;
        description: string;
        type: string;
      }
    ];
    voicenotes: [
      {
        url: string;
        thumbnail: string;
        description: string;
        type: string;
      }
    ];
  };
}
