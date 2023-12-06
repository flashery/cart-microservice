import { CustomError } from '../../../helpers/customeError';
import { ICartDataMapper } from '../../../infrastructure/mappers/ICartDataMapper';
import { Cart } from '../entities/Cart';
import { CartService } from '../entities/CartService';
import { ConsumerNote } from '../entities/ConsumerNote';
import { ICartDTO } from '../../../infrastructure/mappers/ICartDTO';
import { ICartServiceDTO } from '../../../infrastructure/mappers/ICartServiceDTO';
import { IConsumerNote } from '../../../infrastructure/mappers/IConsumerNote';
import { ISuccessMsgDTO } from '../../../infrastructure/mappers/ISuccessMsgDTO';
import { JobMaterials } from '../entities/JobMaterials';
import { CartModel } from '../../../infrastructure/database/mongodb/models/CartModel';
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
import { ICartRepository } from './ICartRepository';
import { IAnswerDTO } from '../../../infrastructure/mappers/IAnswerDTO';
import { Answer } from '../entities/Answer';
import { PricingSummary } from '../entities/PricingSummary';
import { IConsumer } from '../../../infrastructure/mappers/IConsumer';
import { ArchiveService } from '../entities/ArchiveService';

export class CartRepository implements ICartRepository {
  constructor(public dataMapper: ICartDataMapper) {}

  /**
   * Get all the cart or some of the cart
   * depending on the query object
   * @param cart The cart.
   * returns The carts/cart.
   */
  public async getCartByQuery(query: any): Promise<ICartDTO[]> {
    let carts: Cart[] = [];
    if (query) {
      carts = await CartModel.find(query);
    } else {
      carts = await CartModel.find({ status: 'active' });
    }

    this.checkCart(carts, 'CartRepository.getCartByQuery');

    return carts.map((cart) => this.dataMapper.toCartDTO(cart));
  }

  /**
   * Get a single cart object base on the cardId
   * @param cartId The ID of the cart.
   * @returns The cart.
   */
  public async getCart(cartId: string): Promise<ICartDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getCart');

    return this.dataMapper.toCartDTO(cart);
  }

  public async createCart(
    cart: ICartDTO,
    consumer: IConsumer
  ): Promise<ICartDTO> {
    const existingCart: Cart = await CartModel.findOne({
      id: cart.id,
      status: 'active'
    });

    if (existingCart) {
      existingCart.relationships.belongsToConsumer = consumer;
      await CartModel.updateOne({ id: cart.id }, existingCart);

      return this.dataMapper.toCartDTO(existingCart);
    }

    // initialize cart
    cart = {
      ...cart,
      relationships: {
        belongsToConsumer: consumer,
        jobAddress: {}
      },
      properties: {
        createdService: 'consumerApp', // tobe confirmed
        createdBy: cart.id,
        createdDate: new Date().toISOString(),
        modifiedService: 'consumerApp', // tobe confirmed
        modifiedBy: 'consumer', // tobe confirmed
        modifiedDate: new Date().toISOString(),
        __v: 1, // tobe confirmed
        generation: 1 // tobe confirmed
      }
    };

    await CartModel.create(cart);

    const newCart: Cart = await CartModel.findOne({
      id: cart.id,
      status: 'active'
    });

    return this.dataMapper.toCartDTO(newCart);
  }

  public async updateCart(cart: ICartDTO, cartId: string): Promise<ICartDTO> {
    // Update cart
    const updatedCart: Cart = await CartModel.findOneAndUpdate(
      { id: cartId, status: 'active' },
      cart,
      {
        returnDocument: 'after'
      }
    );

    return this.dataMapper.toCartDTO(updatedCart);
  }

  public async deleteCart(cartId: string): Promise<ICartDTO> {
    // Update cart
    const deletedCart: Cart = await CartModel.findOneAndUpdate(
      { id: cartId, status: 'active' },
      {
        status: 'deleted',
        id: `${cartId}-deleted-${new Date().toISOString()}`
      },
      {
        returnDocument: 'after'
      }
    );

    return this.dataMapper.toCartDTO(deletedCart);
  }

  /**
   *  Gets all the cart services.
   *  @param cartId The ID of the cart.
   *  @returns The cart services.
   */
  public async getCartServices(cartId: string): Promise<ICartServiceDTO[]> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getCartServices');

    const category =
      cart.attributes.archivedServiceObjects.length > 0
        ? cart.attributes.archivedServiceObjects[0].category
        : {};

    return cart.attributes.cartServices.map((cartService) =>
      this.dataMapper.toCartServiceDTO({
        cartService,
        ...category
      })
    );
  }

  /**
   *  Gets single the cart services.
   *  @param cartId The ID of the cart.
   *  @param serviceId The ID of the service.
   *  @returns The single cart service.
   */
  public async getCartService(
    cartId: string,
    serviceId: string
  ): Promise<ICartServiceDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getCartService');
    this.checkServices(cart, serviceId, 'CartRepository.getCartService');

    return this.dataMapper.toCartServiceDTO(
      this.findCartService(cart.attributes.cartServices, serviceId)
    );
  }

  /**
   * Creates a cart service.
   * @param cartId The ID of the cart.
   * @param cartService The cart service to add.
   * returns The cart service added.
   */
  public async createCartService(
    cartId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO> {
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    this.checkCart(cart, 'CartRepository.createCartService');

    // validations
    // Note: Commented out for now, will be uncommented once scope is ready
    // const exist = cart.attributes.cartServices.findIndex((item) => {
    //   return item.id === cartService.id;
    // });

    // if (exist > -1) {
    //   // update existing service in cartService
    //   cart.attributes.cartServices[exist] = cartService;
    // } else {
    //   // Add service to cartServices
    //   cart.attributes.cartServices.push(cartService);
    // }

    // Note: Will be remove once scope is ready
    cartService.costDetail = {
      ...cartService.costDetail,
      isCustomQuoteJob: false,
      fixlersServiceMarkupPct: 25,
      fixlersMaterialMarkupPct: 5
    };

    cart.attributes.cartServices = [cartService];

    // Update cart
    cart = await CartModel.findOneAndUpdate(
      {
        id: cartId
      },
      cart,
      { returnDocument: 'after' }
    );

    return this.dataMapper.toCartServiceDTO(
      this.findCartService(cart.attributes.cartServices, cartService.id)
    );
  }

  /**
   * Will create a copy of the service object
   * and will be save to archivedServiceObject
   * @param cartId The ID of the cart.
   * @param service The cart service to add.
   *
   */
  public async createCartArchivedServiceObject(
    cartId: string,
    service: ArchiveService
  ): Promise<void> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.createCartArchivedServiceObject');

    // Note: Commented out for now, will be uncommented once scope is ready
    // const archivedServiceObject = cart.attributes.archivedServiceObjects.find(
    //   (asoItem) => asoItem.id === service.id
    // );

    // if (!archivedServiceObject) {
    //   service.id = service.id;
    //   // Update cart
    //   cart.attributes.archivedServiceObjects.push(service);
    //   await CartModel.updateOne({ id: cartId }, cart);
    // }

    // Note: Will be remove once scope is ready
    service.id = service.id;
    cart.attributes.archivedServiceObjects = [service];
    await CartModel.updateOne({ id: cartId }, cart);
  }

  /**
   * Will create a copy of the service object
   * and will be save to archivedServiceObject
   * @param cartId The ID of the cart.
   * @param service The cart service to add.
   *
   */
  public async getCartArchivedServiceObject(
    cartId: string,
    serviceId: string
  ): Promise<IArchiveServiceObject> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getCartArchivedServiceObject');
    this.checkArchivedServices(
      cart,
      serviceId,
      'CartRepository.getCartArchivedServiceObject'
    );

    return this.dataMapper.toArchivedServiceObject(
      cart.attributes.archivedServiceObjects.find(
        (asoItem) => asoItem.id === serviceId
      )
    );
  }

  /**
   *  Updates a cart service.
   *   @param cartId The ID of the cart.
   *   @param serviceId The ID of the service.
   *   @param cartService The cart service to update.
   *   @returns The cart service updated.
   */
  public async updateCartService(
    cartId: string,
    serviceId: string,
    cartService: CartService
  ): Promise<ICartServiceDTO> {
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    this.checkCart(cart, 'CartRepository.updateCartService');
    this.checkServices(cart, serviceId, 'CartRepository.updateCartService');

    const cartServices = cart.attributes.cartServices.map(
      (cartServiceItem): CartService => {
        let updatedCartService: CartService = cartServiceItem;

        if (this.checkSubDocumentId(cartServiceItem.id, serviceId)) {
          updatedCartService = cartService;
          updatedCartService.id = serviceId;
        }

        return updatedCartService;
      }
    );

    // update cartService to cart
    cart = await CartModel.findOneAndUpdate(
      { id: cartId, 'attributes.cartServices.id': serviceId },
      { $set: { 'attributes.cartServices': cartServices } },
      { returnDocument: 'after' }
    );

    // Update cart
    return this.dataMapper.toCartServiceDTO(
      this.findCartService(cart.attributes.cartServices, serviceId)
    );
  }

  /**
   * Deletes a cart service.
   * @param cartId The ID of the cart.
   * @param serviceId The ID of the service.
   * @returns The cart service deleted.
   */
  public async deleteCartService(
    cartId: string,
    serviceId: string
  ): Promise<ISuccessMsgDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.deleteCartService');
    this.checkServices(cart, serviceId, 'CartRepository.deleteCartService');

    const serviceIndex = this.findCartServiceIndex(
      cart.attributes.cartServices,
      serviceId
    );

    if (serviceIndex === -1) throw new Error('Service not found');

    // delete service
    cart.attributes.cartServices.splice(serviceIndex, 1);

    await CartModel.updateOne({ id: cartId }, cart);

    return {
      message: `CartService with serviceId: ${serviceId} deleted`
    };
  }

  // Job Materials using Mock Data

  /**
   * Insert Job Materials
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * @param jobMaterials - The materials to be inserted
   * return - jobMaterials Inserted
   */
  public async insertJobMaterials(
    cartId: string,
    serviceId: string,
    jobMaterials: JobMaterials
  ): Promise<ICartJobMaterialsDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.insertJobMaterials');
    this.checkServices(cart, serviceId, 'CartRepository.insertJobMaterials');

    // selecting service based on serviceId
    const cartService = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    if (!cartService) throw new Error('Cart Service not found');

    // calculate extended price
    jobMaterials.totalSummary.extendedPrice =
      jobMaterials.totalSummary.quantity * jobMaterials.product.price;

    // if added by consumer it is automatically approved
    if (jobMaterials.addedBy === 'consumer') {
      jobMaterials.consumerApproval.isApprovedByConsumer = true;
      jobMaterials.status = 'Approved';
    }

    // insert job material to the service
    if (!cartService.jobMaterials) {
      cartService.jobMaterials = [jobMaterials];
    } else {
      cartService.jobMaterials.push(jobMaterials);
    }

    // Update cart
    await CartModel.updateOne({ id: cartId }, cart);

    return this.dataMapper.toCartJobMaterialsDTO(cartService.jobMaterials);
  }

  /**
   * Update Job Materials
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * @param materialId - The ID of the material
   * @param jobMaterials - The materials use for update
   * return - new jobmaterials after update
   */
  public async updateJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string,
    jobMaterials: JobMaterials
  ): Promise<ICartJobMaterialsDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.updateJobMaterial');
    this.checkServices(cart, serviceId, 'CartRepository.updateJobMaterial');

    // selecting service based on serviceId
    const cartServiceIndex = this.findCartServiceIndex(
      cart.attributes.cartServices,
      serviceId
    );

    if (cartServiceIndex === -1) throw new Error('Cart Service not found');

    // selecting job material based on materialId
    const jobMaterialsIndex = cart.attributes.cartServices[
      cartServiceIndex
    ].jobMaterials.findIndex((j: any) => j.id?.toString() === materialId);

    if (jobMaterialsIndex === -1) throw new Error('Job Material not found');

    // handle if no ID being passed
    if (!jobMaterials._id) {
      jobMaterials._id = materialId;
    }

    // calculate extended price
    jobMaterials.totalSummary.extendedPrice =
      jobMaterials.totalSummary.quantity * jobMaterials.product.price;

    // updating job material
    cart.attributes.cartServices[cartServiceIndex].jobMaterials[
      jobMaterialsIndex
    ] = jobMaterials;

    // Update cart
    await CartModel.updateOne({ id: cartId }, cart);

    return this.dataMapper.toCartJobMaterialsDTO(
      cart.attributes.cartServices[cartServiceIndex].jobMaterials[
        jobMaterialsIndex
      ]
    );
  }

  /**
   * Get Job Materials
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * return - jobMaterials list
   */
  public async getJobMaterials(
    cartId: string,
    serviceId: string
  ): Promise<ICartJobMaterialsDTO[]> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getJobMaterials');
    this.checkServices(cart, serviceId, 'CartRepository.getJobMaterials');

    // selecting service based on serviceId
    const cartService = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    if (!cartService) throw new Error('Cart Service not found');

    return cartService.jobMaterials.map((jobMaterials: any) =>
      this.dataMapper.toCartJobMaterialsDTO(jobMaterials)
    );
  }

  /**
   * Get Job Materials based on materialId
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * @param materialId - The ID of the material
   * return - jobMaterials based on materialId
   */
  public async getJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ICartJobMaterialsDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getJobMaterial');
    this.checkServices(cart, serviceId, 'CartRepository.getJobMaterial');

    // selecting service based on serviceId
    const cartService = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    if (!cartService) throw new Error('Cart Service not found');

    return this.dataMapper.toCartJobMaterialsDTO(
      cartService.jobMaterials.find(
        (jobMaterial: any) => jobMaterial.id === materialId
      )
    );
  }

  /**
   * Delete Job Materials
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * @param materialId - The ID of the material
   * return - new jobMaterials after delete
   */
  public async deleteJobMaterial(
    cartId: string,
    serviceId: string,
    materialId: string
  ): Promise<ISuccessMsgDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.deleteJobMaterial');
    this.checkServices(cart, serviceId, 'CartRepository.deleteJobMaterial');

    // selecting service based on serviceId
    const cartService = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    if (!cartService) throw new Error('Cart Service not found');

    // selecting job material based on materialId
    const cartJobMaterialsIndex = cartService.jobMaterials.findIndex(
      (j: any) => j.id === materialId
    );

    if (cartJobMaterialsIndex === -1) {
      throw new Error('Job Material not found');
    }

    // delete job material
    cartService.jobMaterials.splice(cartJobMaterialsIndex, 1);

    await CartModel.updateOne({ id: cartId }, cart);

    return {
      message: `CartService Job Material with materialId: ${materialId} has beend deleted`
    };
  }

  // Consumer Notes
  /**
   * Get Consumer Note based on materialId
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * return - consumerNote based on serviceId
   */
  public async getConsumerNote(
    cartId: string,
    serviceId: string
  ): Promise<IConsumerNote> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getConsumerNote');
    this.checkServices(cart, serviceId, 'CartRepository.getConsumerNote');

    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Update cart
    return this.dataMapper.toConsumerNoteDTO(service?.consumerNote);
  }

  /**
   * Update Job Materials
   * @param cartId - The ID of the cart
   * @param serviceId - The ID of the service
   * @param materialId - The ID of the material
   * @param jobMaterials - The materials use for update
   * return - new jobmaterials after update
   */
  public async updateConsumerNote(
    cartId: string,
    serviceId: string,
    consumerNote: ConsumerNote
  ): Promise<IConsumerNote> {
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    this.checkCart(cart, 'CartRepository.updateConsumerNote');
    this.checkServices(cart, serviceId, 'CartRepository.updateConsumerNote');

    cart.attributes.cartServices = cart.attributes.cartServices.map(
      (cartServiceItem: CartService) => {
        if (this.checkSubDocumentId(cartServiceItem.id, serviceId))
          cartServiceItem.consumerNote = consumerNote;

        return cartServiceItem;
      }
    );

    // Update cart
    cart = await CartModel.findOneAndUpdate({ id: cartId }, cart, {
      returnDocument: 'after'
    });
    // Find cartService to cart
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    return this.dataMapper.toConsumerNoteDTO(service?.consumerNote);
  }

  // Cost Detail
  /**
   * Retrieves the cost detail for a given cart and service.
   * @param cartId - The ID of the cart.
   * @param serviceId - The ID of the service.
   * @returns A Promise that resolves to an ICostDetailRegularHours, ICostDetailAfterHours, or ICostDetailFixed object.
   * @throws An error if the cart is not found or if there is an error retrieving the cost detail.
   */
  public async getCostDetail(
    cartId: string,
    serviceId: string
  ): Promise<
    ICostDetailRegularHours | ICostDetailAfterHours | ICostDetailFixed
  > {
    // Retrieve the cart from the database
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getCostDetail');
    this.checkServices(cart, serviceId, 'CartRepository.getCostDetail');

    // Find the service within the cart that matches the given service ID
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Map the cost detail to a DTO and return it
    return this.dataMapper.toCostDetailDTO(service?.costDetail);
  }

  /**
   * Update the cost detail of a service in a cart.
   * @param cartId The ID of the cart to update.
   * @param serviceId The ID of the service to update.
   * @param costDetail The new cost detail to set.
   * @returns A Promise that resolves to the updated cost detail.
   */
  public async updateCostDetail(
    cartId: string,
    serviceId: string,
    costDetail: Fixed | HourlyRegularHours | HourlyAfterHours
  ): Promise<
    ICostDetailRegularHours | ICostDetailAfterHours | ICostDetailFixed
  > {
    // Find the cart by ID
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    this.checkCart(cart, 'CartRepository.updateCostDetail');
    this.checkServices(cart, serviceId, 'CartRepository.updateCostDetail');

    // Update the cart services with the new cost detail
    cart.attributes.cartServices = cart.attributes.cartServices.map(
      (cartServiceItem: CartService) => {
        if (this.checkSubDocumentId(cartServiceItem.id, serviceId))
          cartServiceItem.costDetail = costDetail;

        return cartServiceItem;
      }
    );

    // Update the cart in the database
    cart = await CartModel.findOneAndUpdate({ id: cartId }, cart, {
      returnDocument: 'after'
    });

    // Find the cart service that was updated
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Return the created cost detail as a DTO
    return this.dataMapper.toCostDetailDTO(service?.costDetail);
  }

  // Preferred Timing
  /**
   * Returns the preferred timing for a given service in a cart
   * @param {string} cartId - The ID of the cart to search in
   * @param {string} serviceId - The ID of the service to get the preferred timing for
   * @returns {Promise<IPreferredTiming>} - A promise that resolves to the preferred timing for the service
   * @throws {'Cart not found'} - If no cart is found with the given cartId
   * @throws {Error} - If any other error occurs
   */
  public async getPreferredTiming(
    cartId: string,
    serviceId: string
  ): Promise<IPreferredTiming> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getPreferredTiming');
    this.checkServices(cart, serviceId, 'CartRepository.getPreferredTiming');

    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Return the preferred timing for the service
    return this.dataMapper.toPreferredTimingDTO(service?.preferredTiming);
  }

  /**
   * Updates the preferred timing for a given service in a cart
   * @param cartId - The id of the cart to update
   * @param serviceId - The id of the service to update
   * @param preferredTiming - The new preferred timing for the service
   * @returns The updated preferred timing object
   */
  public async updatePreferredTiming(
    cartId: string,
    serviceId: string,
    preferredTiming: PreferredTiming
  ): Promise<IPreferredTiming> {
    // Find cart by id
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    this.checkCart(cart, 'CartRepository.updatePreferredTiming');
    this.checkServices(cart, serviceId, 'CartRepository.updatePreferredTiming');

    // Update the preferred timing for the service in the cart
    cart.attributes.cartServices = cart.attributes.cartServices.map(
      (cartServiceItem: CartService) => {
        if (this.checkSubDocumentId(cartServiceItem.id, serviceId))
          cartServiceItem.preferredTiming = preferredTiming;

        return cartServiceItem;
      }
    );

    // Save updated cart to database
    cart = await CartModel.findOneAndUpdate({ id: cartId }, cart, {
      returnDocument: 'after'
    });

    // Find the updated service in the cart
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Convert preferred timing object to DTO and return
    return this.dataMapper.toPreferredTimingDTO(service?.preferredTiming);
  }

  // Job Address
  /**
   * Update Job Address.
   * @param cartId The ID of the cart.
   * @param jobAddress The job address to be updated.
   * returns The updated job Address.
   */
  public async updateJobAddress(
    cartId: string,
    jobAddress: JobAddress
  ): Promise<ICartJobAddressDTO> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.updateJobAddress');
    // updating job address
    cart.relationships.jobAddress = jobAddress;

    // Update cart
    await CartModel.updateOne({ id: cartId }, cart);

    return this.dataMapper.toCartJobAddressDTO(cart.relationships.jobAddress);
  }

  /**
   * Get Job Address.
   * @param cartId The ID of the cart.
   * returns The job Address.
   */
  public async getJobAddress(cartId: string): Promise<ICartJobAddressDTO> {
    const cart: Cart = await CartModel.findOne({ id: cartId });

    this.checkCart(cart, 'CartRepository.getJobAddress');

    return this.dataMapper.toCartJobAddressDTO(cart.relationships.jobAddress);
  }

  // Cart Service Quantity
  /**
   * Retrieves the quantity of a given service in a cart.
   * @param cartId The ID of the cart to retrieve the quantity from.
   * @param serviceId The ID of the service to retrieve the quantity for.
   * @returns A Promise that resolves to an IQuantityDTO object.
   */
  public async getQuantity(cartId: string, serviceId: string): Promise<number> {
    // Retrieve the cart from the database.
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    // Verify that the cart exists and has the required attributes.
    this.checkCart(cart, 'CartRepository.getQuantity');
    this.checkServices(cart, serviceId, 'CartRepository.getQuantity');

    // Retrieve the service from the cart.
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );
    // Return the quantity of the service (or 0 if it doesn't exist).
    return this.dataMapper.toQuantityDTO(service?.quantity ?? 0);
  }

  /**
   * Updates the quantity of a service in a cart
   * @param cartId - the ID of the cart to update
   * @param serviceId - the ID of the service to update
   * @param quantity - the new quantity of the service
   * @returns a promise that resolves to a quantity DTO
   */
  public async updateQuantity(
    cartId: string,
    serviceId: string,
    quantity: number
  ): Promise<number> {
    // Find cart by id
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    // Check if cart exists and throw an error if not
    this.checkCart(cart, 'CartRepository.updateQuantity');

    // Check if service exists in the cart and throw an error if not
    this.checkServices(cart, serviceId, 'CartRepository.updateQuantity');

    // Update the preferred timing for the service in the cart
    cart.attributes.cartServices = cart.attributes.cartServices.map(
      (cartServiceItem: CartService) => {
        if (this.checkSubDocumentId(cartServiceItem.id, serviceId))
          cartServiceItem.quantity = quantity;

        return cartServiceItem;
      }
    );

    // Save updated cart to database
    // Use findOneAndUpdate to update the cart and return the updated document
    cart = await CartModel.findOneAndUpdate({ id: cartId }, cart, {
      returnDocument: 'after'
    });

    // Find the updated service in the cart
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    // Convert preferred timing object to DTO and return
    return this.dataMapper.toQuantityDTO(service?.quantity ?? 0);
  }

  // Cart Service Answers
  public async getAnswers(
    cartId: string,
    serviceId: string
  ): Promise<IAnswerDTO[]> {
    // Retrieve the cart from the database.
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    // Verify that the cart exists and has the required attributes.
    this.checkCart(cart, 'CartRepository.getAnswers');
    this.checkServices(cart, serviceId, 'CartRepository.getAnswers');

    // Retrieve the service from the cart.
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    const answers = service?.answers;

    if (answers === undefined) {
      return [];
    }

    return answers.map((answer) => this.dataMapper.toAnswersDTO(answer));
    // Convert preferred timing object to DTO and return
  }

  public async updateAnswers(
    cartId: string,
    serviceId: string,
    answers: Answer[]
  ): Promise<IAnswerDTO[]> {
    // Find cart by id
    let cart: Cart = await CartModel.findOne({ id: cartId, status: 'active' });

    // Check if cart exists and throw an error if not
    this.checkCart(cart, 'CartRepository.updateAnswers');

    // Check if service exists in the cart and throw an error if not
    this.checkServices(cart, serviceId, 'CartRepository.updateAnswers');

    // Update the preferred timing for the service in the cart
    cart.attributes.cartServices = cart.attributes.cartServices.map(
      (cartServiceItem: CartService) => {
        if (this.checkSubDocumentId(cartServiceItem.id, serviceId))
          cartServiceItem.answers = answers;

        return cartServiceItem;
      }
    );

    // Save updated cart to database
    // Use findOneAndUpdate to update the cart and return the updated document
    cart = await CartModel.findOneAndUpdate({ id: cartId }, cart, {
      returnDocument: 'after'
    });

    // Find the updated service in the cart
    const service = this.findCartService(
      cart.attributes.cartServices,
      serviceId
    );

    const updatedAnswers = service?.answers;

    if (updatedAnswers === undefined) {
      return [] as IAnswerDTO[];
    }

    // Convert preferred timing object to DTO and return
    return updatedAnswers.map((answer: Answer) =>
      this.dataMapper.toAnswersDTO(answer)
    );
  }

  public async getPricingSummary(cartId: string): Promise<PricingSummary> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.getPricingSummary');

    const pricingSummary: PricingSummary = cart.attributes.pricingSummary;

    if (!pricingSummary)
      // Return a default object
      return this.dataMapper.toPricingSummaryDTO({
        materialCostDetail: {
          totalMaterialCost: 0,
          fixlersMaterialMarkupPct: 0,
          fixlersMaterialMarkupFee: 0
        },
        serviceCostDetail: {
          totalServiceCost: 0,
          fixlersServiceMarkupPct: 0,
          fixlersServiceMarkupFee: 0
        },
        totalCost: 0,
        totalFixlersMarkupFee: 0,
        subTotal: 0,
        taxPct: 0,
        taxAmount: 0,
        grandTotal: 0
      });

    return this.dataMapper.toPricingSummaryDTO(pricingSummary);
  }

  public async updatePricingSummary(
    cartId: string,
    pricingSummary: PricingSummary
  ): Promise<PricingSummary> {
    const cart: Cart = await CartModel.findOne({
      id: cartId,
      status: 'active'
    });

    this.checkCart(cart, 'CartRepository.updatePricingSummary');

    // Save updated cart to database
    // Use findOneAndUpdate to update the cart and return the updated document
    cart.attributes.pricingSummary = pricingSummary;

    const updatedCart: Cart = await CartModel.findOneAndUpdate(
      { id: cartId },
      cart,
      {
        returnDocument: 'after'
      }
    );

    this.checkPricingSummary(updatedCart, 'CartRepository.getPricingSummary');
    const { pricingSummary: updatedPricingSummary } = updatedCart.attributes;

    return this.dataMapper.toPricingSummaryDTO(updatedPricingSummary);
  }

  /**
   * Checks if the provided cart is valid.
   * @param cart The cart to check.
   * @param name The name of the cart.
   * @throws CustomError if the cart is not found or empty.
   */
  public checkCart(cart: Cart[] | Cart, name: string): void {
    if (!cart || (Array.isArray(cart) && cart.length === 0)) {
      throw new CustomError('Cart not found!', name, 404);
    }
  }

  /**
   * Check if a specific archived service exists in the cart.
   * @param cart The cart to check.
   * @param serviceId The ID of the service to search for.
   * @param name The name of the function calling this method.
   * @throws {CustomError} If archived services cannot be found or the requested service is not found.
   */
  public checkArchivedServices(
    cart: Cart,
    serviceId: string,
    name: string
  ): void {
    // Get the archived service objects from the cart attributes
    const { archivedServiceObjects } = cart.attributes;

    // Throw an error if archived services cannot be found or the array is empty
    if (
      !archivedServiceObjects ||
      (Array.isArray(archivedServiceObjects) &&
        archivedServiceObjects.length === 0)
    ) {
      throw new CustomError('Archived services not found!', name, 404);
    }

    // Find the requested service in the archived service objects
    const service: ArchiveService | undefined = archivedServiceObjects.find(
      (s: ArchiveService) => s.id === serviceId
    );

    // Throw an error if the requested service cannot be found in the archived service objects
    if (!service) {
      throw new CustomError('Archived service not found!', name, 404);
    }
  }

  /**
   * Check if the cart has a pricing summary attribute and throws an error if not found.
   * @param cart - The cart object to be checked.
   * @param name - The name of the error to be thrown.
   * @throws CustomError - If the pricing summary attribute does not exist in the cart object.
   */
  public checkPricingSummary(cart: Cart, name: string): void {
    const { pricingSummary } = cart.attributes;
    // Check if the pricing summary attribute exists in the cart object.
    if (!pricingSummary) {
      // Throw an error with the given name and status code 404 if the attribute is not found.
      throw new CustomError('Pricing summary not found!', name, 404);
    }
  }

  /**
   * Check if a given service is present in the cart.
   * @param cart - The cart object that contains the cart services.
   * @param serviceId - The ID of the service to look for in the cart.
   * @param name - The name of the function calling this method.
   * @throws {CustomError} - If cart services or the specific service is not found in the cart.
   */
  public checkServices(cart: Cart, serviceId: string, name: string): void {
    // Get the cart services from the cart attributes
    const { cartServices } = cart.attributes;

    // Throw an error if cart services are not found or if it is an empty array
    if (
      !cartServices ||
      (Array.isArray(cartServices) && cartServices.length === 0)
    )
      throw new CustomError('Cart services not found!', name, 404);

    // Find the cart service with the given service ID
    const cartService: CartService | undefined = this.findCartService(
      cartServices,
      serviceId
    );

    // Throw an error if the cart service with the given service ID is not found
    if (!cartService)
      throw new CustomError('Cart service not found!', name, 404);
  }

  /**
   * Update the cost detail of a service in a cart.
   * @param cartId The ID of the cart to update.
   * @param serviceId The ID of the service to update.
   * @param isCustomQuoteJob The isCustomQuoteJob to set.
   * @returns A boolean.
   */
  public async putCartService(
    cartId: string,
    data: ICartServiceDTO
  ): Promise<ICartServiceDTO> {
    // Update cart
    const cart = await CartModel.findOneAndUpdate(
      { id: cartId, status: 'active' },
      {
        $set: {
          'attributes.cartServices.$[].consumerNote': data.consumerNote,
          'attributes.cartServices.$[].costDetail.isCustomQuoteJob':
            data.costDetail.isCustomQuoteJob
        }
      },
      { returnDocument: 'after' }
    );

    return this.dataMapper.toCartServiceDTO(cart);
  }

  findCartService(cartServices: CartService[], serviceId: string) {
    return cartServices.find((service: CartService) =>
      this.checkSubDocumentId(service.id, serviceId)
    );
  }

  findCartServiceIndex(cartServices: CartService[], serviceId: string) {
    return cartServices.findIndex((service: CartService) =>
      this.checkSubDocumentId(service.id, serviceId)
    );
  }

  checkSubDocumentId(subDocumentId: string, id: string): boolean {
    return subDocumentId === id;
  }
}
