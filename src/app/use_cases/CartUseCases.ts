import { CartService } from '../domain/entities/CartService';
import { ConsumerNote } from '../domain/entities/ConsumerNote';
import { JobMaterials } from '../domain/entities/JobMaterials';
import { ICartRepository } from '../domain/repositories/ICartRepository';
import { ICartDTO } from '../../infrastructure/mappers/ICartDTO';
import { ICartServiceDTO } from '../../infrastructure/mappers/ICartServiceDTO';
import { IConsumerNote } from '../../infrastructure/mappers/IConsumerNote';
import { ISuccessMsgDTO } from '../../infrastructure/mappers/ISuccessMsgDTO';
import { JobAddress } from '../domain/entities/JobAddress';
import { ICartJobAddressDTO } from '../../infrastructure/mappers/ICartJobAddressDTO';
import { ICartJobMaterialsDTO } from '../../infrastructure/mappers/ICartJobMaterialsDTO';
import { ICostDetailAfterHours } from '../../infrastructure/mappers/cost-detail/ICostDetailAfterHours';
import { ICostDetailRegularHours } from '../../infrastructure/mappers/cost-detail/ICostDetailRegularHours';
import { ICostDetailFixed } from '../../infrastructure/mappers/cost-detail/ICostDetailFixed';
import { PreferredTiming } from '../domain/entities/preferred-timing/PreferredTiming';
import { IPreferredTiming } from '../../infrastructure/mappers/IPreferredTiming';
import calculateServicePrice from '../../helpers/calculateServicePrice';
import { ICostDetailRequestObj } from '../../infrastructure/mappers/ICostDetailRequestObj';
import { Answer } from '../domain/entities/Answer';
import { IAnswerDTO } from '../../infrastructure/mappers/IAnswerDTO';
import { IStateTax } from '../../infrastructure/mappers/IStateTax';
import { PricingSummary } from '../domain/entities/PricingSummary';
import { calculateExtendedMaterialCost } from '../../helpers/calculateMaterialCostDetail';
import { IConsumer } from '../../infrastructure/mappers/IConsumer';
import calculatePricingSummary, {
  getMaterialCostDetail
} from '../../helpers/calculatePricingSummary';
import { ArchiveService } from '../domain/entities/ArchiveService';
import { Fixed } from '../domain/entities/cost-detail/Fixed';
import { HourlyAfterHours } from '../domain/entities/cost-detail/HourlyAfterHours';
import { HourlyRegularHours } from '../domain/entities/cost-detail/HourlyRegularHours';

export class CartUseCases {
  constructor(private cartRepository: ICartRepository) {}

  // Carts
  public async getCart(cartId: string): Promise<ICartDTO> {
    return this.cartRepository.getCart(cartId);
  }

  public async getCartByQuery(query: any): Promise<ICartDTO[]> {
    return this.cartRepository.getCartByQuery(query);
  }

  public async createCart(
    cart: ICartDTO,
    consumer: IConsumer
  ): Promise<ICartDTO> {
    return this.cartRepository.createCart(cart, consumer);
  }

  public async updateCart(cart: ICartDTO, cartId: string): Promise<ICartDTO> {
    return this.cartRepository.updateCart(cart, cartId);
  }

  public async deleteCart(cartId: string): Promise<ICartDTO> {
    return this.cartRepository.deleteCart(cartId);
  }

  // Cart Services
  public async getCartServices(cartId: string): Promise<ICartServiceDTO[]> {
    return this.cartRepository.getCartServices(cartId);
  }

  public async getCartService(
    cartId: string,
    serviceId: string
  ): Promise<ICartServiceDTO> {
    return this.cartRepository.getCartService(cartId, serviceId);
  }

  public async createCartService(
    cartId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO> {
    return this.cartRepository.createCartService(cartId, cartService);
  }

  public async createCartArchivedServiceObject(
    cartId: string,
    service: ArchiveService
  ) {
    return this.cartRepository.createCartArchivedServiceObject(cartId, service);
  }

  public async updateCartService(
    cartId: string,
    serviceId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO> {
    return this.cartRepository.updateCartService(
      cartId,
      serviceId,
      cartService
    );
  }

  public async deleteCartService(
    cartId: string,
    serviceId: string
  ): Promise<ISuccessMsgDTO> {
    return this.cartRepository.deleteCartService(cartId, serviceId);
  }

  /**
   * @param cartId The ID of the cart.
   * @param serviceId The ID of the service.
   * @returns The update service cost detail
   */
  public async updateMaterialCostDetail(
    cartId: string,
    serviceId: string
  ): Promise<
    ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed
  > {
    // get cost detail
    const costDetail = await this.getCostDetail(cartId, serviceId);

    // get job materials list
    const jobMaterials = await this.getJobMaterials(cartId, serviceId);

    // calculate material cost in a service
    // const materialCostDetail =
    //   calculateMaterialCostDetailInService(jobMaterials);

    const materialCostDetail = getMaterialCostDetail(jobMaterials, costDetail);

    // calculate extended material cost
    const newCostDetail = calculateExtendedMaterialCost(
      costDetail,
      materialCostDetail
    );

    console.log('materialCostDetail', materialCostDetail);

    // calculate pricing summary after updating material costdetail
    const pricingSummary: PricingSummary =
      await this.cartRepository.getPricingSummary(cartId);

    const updatedPricingSummary: PricingSummary = calculatePricingSummary(
      pricingSummary,
      costDetail,
      { stateName: '', taxPer: pricingSummary.taxPct },
      materialCostDetail
    );

    await this.cartRepository.updatePricingSummary(
      cartId,
      updatedPricingSummary
    );

    // updating cost detail
    return this.cartRepository.updateCostDetail(
      cartId,
      serviceId,
      newCostDetail
    );
  }

  public async insertJobMaterials(
    cartId: string,
    serviceId: string,
    jobMaterial: JobMaterials
  ): Promise<ICartJobMaterialsDTO> {
    const response = await this.cartRepository.insertJobMaterials(
      cartId,
      serviceId,
      jobMaterial
    );
    await this.updateMaterialCostDetail(cartId, serviceId);
    return response;
  }

  public async updateJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string,
    jobMaterial: JobMaterials
  ) {
    const response = await this.cartRepository.updateJobMaterial(
      cartId,
      serviceId,
      materialId,
      jobMaterial
    );
    await this.updateMaterialCostDetail(cartId, serviceId);

    return response;
  }

  public async getJobMaterials(
    cartId: string,
    serviceId: string
  ): Promise<ICartJobMaterialsDTO[]> {
    return this.cartRepository.getJobMaterials(cartId, serviceId);
  }

  public async getJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ICartJobMaterialsDTO> {
    return this.cartRepository.getJobMaterial(cartId, serviceId, materialId);
  }

  public async deleteJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ISuccessMsgDTO> {
    const response = this.cartRepository.deleteJobMaterial(
      cartId,
      serviceId,
      materialId
    );
    await this.updateMaterialCostDetail(cartId, serviceId);

    return response;
  }

  // Consumer Note Use Cases
  public async getConsumerNote(
    cartId: string,
    serviceId: string
  ): Promise<IConsumerNote> {
    return this.cartRepository.getConsumerNote(cartId, serviceId);
  }

  public async updateConsumerNote(
    cartId: string,
    serviceId: string,
    consumerNote: ConsumerNote
  ) {
    return this.cartRepository.updateConsumerNote(
      cartId,
      serviceId,
      consumerNote
    );
  }

  // Cost Detail
  public async getCostDetail(
    cartId: string,
    serviceId: string
  ): Promise<
    ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed
  > {
    return this.cartRepository.getCostDetail(cartId, serviceId);
  }

  public async updateCostDetail(
    cartId: string,
    serviceId: string,
    data: ICostDetailRequestObj,
    tax: IStateTax
  ): Promise<
    ICostDetailAfterHours | ICostDetailRegularHours | ICostDetailFixed
  > {
    let costDetail: Fixed | HourlyAfterHours | HourlyRegularHours | undefined =
      await this.getCostDetail(cartId, serviceId);

    const service: any = await this.cartRepository.getCartArchivedServiceObject(
      cartId,
      serviceId
    );

    const preferedTiming: any = await this.cartRepository.getPreferredTiming(
      cartId,
      serviceId
    );

    const { pricing } = service;

    const pricingSummary: PricingSummary =
      await this.cartRepository.getPricingSummary(cartId);

    const quantity: number = await this.cartRepository.getQuantity(
      cartId,
      serviceId
    );

    const calcData: Fixed | HourlyAfterHours | HourlyRegularHours =
      calculateServicePrice(
        pricing,
        preferedTiming,
        data,
        quantity,
        costDetail
      );

    if (calcData) {
      costDetail = await this.cartRepository.updateCostDetail(
        cartId,
        serviceId,
        calcData
      );
    }

    // Calculate pricingSummary only if it is not custom job

    const updatedPricingSummary: PricingSummary = calculatePricingSummary(
      pricingSummary,
      calcData,
      tax,
      null
    );

    await this.cartRepository.updatePricingSummary(
      cartId,
      updatedPricingSummary
    );

    return costDetail;
  }

  // Preferred Timing
  public async getPreferredTiming(
    cartId: string,
    serviceId: string
  ): Promise<IPreferredTiming> {
    return this.cartRepository.getPreferredTiming(cartId, serviceId);
  }

  public async updatePreferredTiming(
    cartId: string,
    serviceId: string,
    preferedTiming: PreferredTiming
  ): Promise<IPreferredTiming> {
    return this.cartRepository.updatePreferredTiming(
      cartId,
      serviceId,
      preferedTiming
    );
  }

  // Job Address
  public async updateJobAddress(
    cartId: string,
    jobAddress: JobAddress
  ): Promise<ICartJobAddressDTO> {
    return this.cartRepository.updateJobAddress(cartId, jobAddress);
  }

  public async getJobAddress(cartId: string): Promise<ICartJobAddressDTO> {
    return this.cartRepository.getJobAddress(cartId);
  }

  // Cart Service Quantity
  public async getQuantity(cartId: string, serviceId: string): Promise<number> {
    return this.cartRepository.getQuantity(cartId, serviceId);
  }

  public async updateQuantity(
    cartId: string,
    serviceId: string,
    quantity: number
  ): Promise<number> {
    return this.cartRepository.updateQuantity(cartId, serviceId, quantity);
  }

  // Cart Service Quantity
  public async getAnswers(
    cartId: string,
    serviceId: string
  ): Promise<IAnswerDTO[]> {
    return this.cartRepository.getAnswers(cartId, serviceId);
  }

  public async updateAnswers(
    cartId: string,
    serviceId: string,
    answers: Answer[]
  ): Promise<IAnswerDTO[]> {
    return this.cartRepository.updateAnswers(cartId, serviceId, answers);
  }

  public async putCartService(
    cartId: string,
    data: ICartServiceDTO
  ): Promise<ICartServiceDTO> {
    return this.cartRepository.putCartService(cartId, data);
  }
}
