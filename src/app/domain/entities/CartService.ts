import { JobMaterials } from './JobMaterials';
import { ConsumerNote } from './ConsumerNote';
import { HourlyRegularHours } from './cost-detail/HourlyRegularHours';
import { HourlyAfterHours } from './cost-detail/HourlyAfterHours';
import { Fixed } from './cost-detail/Fixed';
import { PreferredTiming } from './preferred-timing/PreferredTiming';
import { Answer } from './Answer';
export class CartService {
  constructor(
    public id: string,
    public serviceName: string,
    public description: string,
    public quantity: number,
    public answers: Answer[],
    public consumerNote: ConsumerNote,
    public costDetail: Fixed | HourlyRegularHours | HourlyAfterHours,
    public preferredTiming: PreferredTiming,
    public jobMaterials: JobMaterials[]
  ) {}
}
