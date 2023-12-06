import { ICartDTO } from './ICartDTO';
import { ICartJobMaterialsDTO } from './ICartJobMaterialsDTO';
import { ICartJobAddressDTO } from './ICartJobAddressDTO';
import { ICartServiceDTO } from './ICartServiceDTO';
import { IConsumerNote } from './IConsumerNote';
import { ICostDetailRegularHours } from './cost-detail/ICostDetailRegularHours';
import { ICostDetailAfterHours } from './cost-detail/ICostDetailAfterHours';
import { ICostDetailFixed } from './cost-detail/ICostDetailFixed';
import { IArchiveServiceObject } from './IArchiveServiceObject';
import { IPreferredTiming } from './IPreferredTiming';
import { IAnswerDTO } from './IAnswerDTO';
import { PricingSummary } from '../../app/domain/entities/PricingSummary';

export interface ICartDataMapper {
  toCartDTO(doc: any): ICartDTO;
  toCartServiceDTO(doc: any): ICartServiceDTO;
  toCartJobMaterialsDTO(doc: any): ICartJobMaterialsDTO;
  toConsumerNoteDTO(doc: any): IConsumerNote;
  toArchivedServiceObject(doc: any): IArchiveServiceObject;
  toCostDetailDTO(
    doc: any
  ): ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed;
  toPreferredTimingDTO(doc: any): IPreferredTiming;
  toCartJobAddressDTO(doc: any): ICartJobAddressDTO;
  toQuantityDTO(quantity: number): number;
  toAnswersDTO(answer: any): IAnswerDTO;
  toPricingSummaryDTO(pricingSummary: any): PricingSummary;
}
