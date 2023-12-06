// ProductDataMapper.ts
import { ICostDetailFixed } from './cost-detail/ICostDetailFixed';
import { ICostDetailRegularHours } from './cost-detail/ICostDetailRegularHours';
import { ICostDetailAfterHours } from './cost-detail/ICostDetailAfterHours';
import { IArchiveServiceObject } from './IArchiveServiceObject';
import { ICartDataMapper } from './ICartDataMapper';
import { ICartDTO } from './ICartDTO';
import { ICartJobAddressDTO } from './ICartJobAddressDTO';
import { ICartJobMaterialsDTO } from './ICartJobMaterialsDTO';
import { ICartServiceDTO } from './ICartServiceDTO';
import { IConsumerNote } from './IConsumerNote';
import { IPreferredTiming } from './IPreferredTiming';
import { IAnswerDTO } from './IAnswerDTO';
import { PricingSummary } from '../../app/domain/entities/PricingSummary';

export class CartDataMapper implements ICartDataMapper {
  /**
   * Converts the given document object to a cart DTO object.
   *
   * @param {any} doc - The document object to convert.
   * @return {ICartDTO} The cart DTO object.
   */
  public toCartDTO(doc: any): ICartDTO {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Converts the given document to a Cart Service DTO.
   *
   * @param {any} doc - the document to convert
   * @return {ICartServiceDTO} the converted Cart Service DTO
   */
  public toCartServiceDTO(doc: any): ICartServiceDTO {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Converts the given document to a CartJobMaterialsDTO object.
   *
   * @param {any} doc - The document to be converted.
   * @return {ICartJobMaterialsDTO} The converted CartJobMaterialsDTO object.
   */
  public toCartJobMaterialsDTO(doc: any): ICartJobMaterialsDTO {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Converts a document to an archived service object.
   *
   * @param {any} doc - the document to convert
   * @return {IArchiveServiceObject} the converted archived service object
   */
  public toArchivedServiceObject(doc: any): IArchiveServiceObject {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Returns an IConsumerNote object from the given input document.
   *
   * @param {any} doc - The document to transform.
   * @return {IConsumerNote} The transformed IConsumerNote object.
   */
  public toConsumerNoteDTO(doc: any): IConsumerNote {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Returns either an ICostDetailHourly or ICostDetailFixed object after converting the given
   * 'doc' object to an object if it is not, using `toObject` method if it exists.
   *
   * @param {any} doc - the input object to be converted to ICostDetailHourly or ICostDetailFixed object.
   * @return {ICostDetailHourly | ICostDetailFixed} - the converted object.
   */
  public toCostDetailDTO(
    doc: any
  ): ICostDetailRegularHours | ICostDetailAfterHours | ICostDetailFixed {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Returns either an ICostDetailHourly or ICostDetailFixed object after converting the given
   * 'doc' object to an object if it is not, using `toObject` method if it exists.
   *
   * @param {any} doc - the input object to be converted to ICostDetailHourly or ICostDetailFixed object.
   * @return {ICostDetailHourly | ICostDetailFixed} - the converted object.
   */
  public toPreferredTimingDTO(doc: any): IPreferredTiming {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  /**
   * Converts the given document to a ICartJobAddressDTO object.
   *
   * @param {any} doc - The document to be converted.
   * @return {IICartJobAddressDTO} The converted ICartJobAddressDTO object.
   */
  public toCartJobAddressDTO(doc: any): ICartJobAddressDTO {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  public toQuantityDTO(quantity: number): number {
    return quantity;
  }

  /**
   * Converts a document to a Quantity DTO.
   *
   * @param {any} doc - the document to be converted
   * @return {IQuantityDTO} the converted Quantity DTO
   */
  public toAnswersDTO(doc: any): IAnswerDTO {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }

  public toPricingSummaryDTO(doc: any): PricingSummary {
    const docObject = doc?.toObject ? doc?.toObject() : doc;
    return docObject;
  }
}
