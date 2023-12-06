import { Ancestor } from './Ancestor';

export class Category {
  constructor(
    public categoryName: string,
    public description: string,
    public ancestor: Ancestor[],
    public slug: string,
    public path: string,
    public thumbnail: string
  ) {}
}
