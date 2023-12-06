import { FacetList } from './FacetList';

export class JobMaterial {
  constructor(
    public name: string,
    public productType: string,
    public isMandatory: boolean,
    public facetList: FacetList[]
  ) {}
}
