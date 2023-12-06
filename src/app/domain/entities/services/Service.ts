import { Category } from './Category';
import { Facet } from './Facet';
import { JobMaterial } from './JobMaterial';
import { Question } from './Question';

export class Service {
  constructor(
    public id: string,
    public category: Category[],
    public description: string,
    public price: number,
    public questions: Question[],
    public facets: Facet,
    public serviceName: string,
    public jobMaterials: JobMaterial[]
  ) {}
}
