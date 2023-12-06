import { CartService } from '../entities/CartService';
import { ConsumerNote } from '../entities/ConsumerNote';
import { JobMaterials } from '../entities/JobMaterials';
import { ICartDTO } from '../../../infrastructure/mappers/ICartDTO';
import { ICartServiceDTO } from '../../../infrastructure/mappers/ICartServiceDTO';
import { IConsumerNote } from '../../../infrastructure/mappers/IConsumerNote';
import { ISuccessMsgDTO } from '../../../infrastructure/mappers/ISuccessMsgDTO';
import { JobAddress } from '../entities/JobAddress';
import { ICartJobAddressDTO } from '../../../infrastructure/mappers/ICartJobAddressDTO';
import { ICartJobMaterialsDTO } from '../../../infrastructure/mappers/ICartJobMaterialsDTO';
import { IArchiveServiceObject } from '../../../infrastructure/mappers/IArchiveServiceObject';
import { IPreferredTiming } from '../../../infrastructure/mappers/IPreferredTiming';
import { PreferredTiming } from '../entities/preferred-timing/PreferredTiming';
import { ICostDetailRegularHours } from '../../../infrastructure/mappers/cost-detail/ICostDetailRegularHours';
import { ICostDetailAfterHours } from '../../../infrastructure/mappers/cost-detail/ICostDetailAfterHours';
import { ICostDetailFixed } from '../../../infrastructure/mappers/cost-detail/ICostDetailFixed';
import { Fixed } from '../entities/cost-detail/Fixed';
import { HourlyRegularHours } from '../entities/cost-detail/HourlyRegularHours';
import { HourlyAfterHours } from '../entities/cost-detail/HourlyAfterHours';
import { IAnswerDTO } from '../../../infrastructure/mappers/IAnswerDTO';
import { Answer } from '../entities/Answer';
import { PricingSummary } from '../entities/PricingSummary';
import { IConsumer } from '../../../infrastructure/mappers/IConsumer';
import { ArchiveService } from '../entities/ArchiveService';

export interface ICartRepository {
  // Carts
  getCart(cartId: string): Promise<ICartDTO>;
  getCartByQuery(query: any): Promise<ICartDTO[]>;
  createCart(cart: ICartDTO, consumer: IConsumer): Promise<ICartDTO>;
  updateCart(cart: ICartDTO, cartId: string): Promise<ICartDTO>;
  deleteCart(cartId: string): Promise<ICartDTO>;
  // Cart Services
  getCartServices(cartId: string): Promise<ICartServiceDTO[]>;
  getCartService(cartId: string, serviceId: string): Promise<ICartServiceDTO>;
  createCartService(
    cartId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO>;
  createCartArchivedServiceObject(
    cartId: string,
    service: ArchiveService
  ): Promise<void>;
  getCartArchivedServiceObject(
    cartId: string,
    serviceId: string
  ): Promise<IArchiveServiceObject>;
  updateCartService(
    cartId: string,
    serviceId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO>;
  deleteCartService(cartId: string, serviceId: string): Promise<ISuccessMsgDTO>;
  insertJobMaterials(
    cartId: string,
    serviceId: string,
    jobMaterial: JobMaterials
  ): Promise<ICartJobMaterialsDTO>;
  updateJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string,
    jobMaterial: JobMaterials
  ): Promise<ICartJobMaterialsDTO>;
  getJobMaterials(
    cartId: string,
    serviceId: string
  ): Promise<ICartJobMaterialsDTO[]>;
  getJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ICartJobMaterialsDTO>;
  deleteJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ISuccessMsgDTO>;
  // Consumer Note
  getConsumerNote(cartId: string, serviceId: string): Promise<IConsumerNote>;
  updateConsumerNote(
    cartId: string,
    serviceId: string,
    consumerNote: ConsumerNote
  ): Promise<IConsumerNote>;

  // Cost Detail
  getCostDetail(
    cartId: string,
    serviceId: string
  ): Promise<
    ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed
  >;
  updateCostDetail(
    cartId: string,
    serviceId: string,
    costDetail: Fixed | HourlyRegularHours | HourlyAfterHours
  ): Promise<
    ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed
  >;
  // Prefered Timing
  getPreferredTiming(
    cartId: string,
    serviceId: string
  ): Promise<IPreferredTiming>;
  updatePreferredTiming(
    cartId: string,
    serviceId: string,
    preferedTiming: PreferredTiming
  ): Promise<IPreferredTiming>;
  updateJobAddress(
    cartId: string,
    jobAddress: JobAddress
  ): Promise<ICartJobAddressDTO>;
  getJobAddress(cartId: string): Promise<ICartJobAddressDTO>;
  // Cart Service Quantity
  getQuantity(cartId: string, serviceId: string): Promise<number>;
  updateQuantity(
    cartId: string,
    serviceId: string,
    quantity: number
  ): Promise<number>;
  getAnswers(cartId: string, serviceId: string): Promise<IAnswerDTO[]>;
  updateAnswers(
    cartId: string,
    serviceId: string,
    answers: Answer[]
  ): Promise<IAnswerDTO[]>;
  getPricingSummary(cartId: string): Promise<PricingSummary>;
  updatePricingSummary(
    cartId: string,
    pricingSummary: PricingSummary
  ): Promise<PricingSummary>;
  putCartService(
    cartId: string,
    data: ICartServiceDTO
  ): Promise<ICartServiceDTO>;
}
