import { Media } from './Media';
export class ConsumerNote {
  constructor(
    public content: string,
    public media: {
      images: Media[];
      videos: Media[];
      voicenotes: Media[];
    }
  ) {}
}
