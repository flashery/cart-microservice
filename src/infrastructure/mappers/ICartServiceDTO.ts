import { IConsumerNote } from './IConsumerNote';
import { ICartJobMaterialsDTO } from './ICartJobMaterialsDTO';
import { ICostDetailRegularHours } from './cost-detail/ICostDetailRegularHours';
import { ICostDetailAfterHours } from './cost-detail/ICostDetailAfterHours';
import { ICostDetailFixed } from './cost-detail/ICostDetailFixed';
import { IAnswerDTO } from './IAnswerDTO';
import { ArchivedServiceOject } from './attributes/ArchivedServiceOject';
export interface ICartServiceDTO {
  id: string;
  serviceId: string;
  quantity: number;
  answers: IAnswerDTO[];
  consumerNote: IConsumerNote;
  costDetail:
    | ICostDetailRegularHours
    | ICostDetailAfterHours
    | ICostDetailFixed;
  jobMaterials: ICartJobMaterialsDTO[];
  archivedServiceObjects: ArchivedServiceOject;
}
