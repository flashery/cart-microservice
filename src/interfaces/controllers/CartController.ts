import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction
} from 'express';
import { CartUseCases } from '../../app/use_cases/CartUseCases';
import { JobMaterials } from '../../app/domain/entities/JobMaterials';
import { IConsumerNote } from '../../infrastructure/mappers/IConsumerNote';
import { AxiosServiceRestClient } from '../../infrastructure/externalApis/MicroServices/services/AxiosServiceRestClient';
import { AxiosTaxes } from '../../infrastructure/externalApis/LegacyAPI/taxes/AxiosTaxes';
import { PreferredTiming } from '../../app/domain/entities/preferred-timing/PreferredTiming';
import { features } from '../../infrastructure/config/symbols';
import { AxiosAddressMS } from '../../infrastructure/externalApis/LegacyAPI/address/AxiosAddressMS';
import { ICostDetailRequestObj } from '../../infrastructure/mappers/ICostDetailRequestObj';
import { ICartDTO } from '../../infrastructure/mappers/ICartDTO';
import { Answer } from '../../app/domain/entities/Answer';
import { IStateTax } from '../../infrastructure/mappers/IStateTax';
import { AxiosConsumerMS } from '../../infrastructure/externalApis/LegacyAPI/consumer/AxiosConsumerMS';

export class CartController {
  private serviceRestClient: AxiosServiceRestClient;

  private taxRestClient: AxiosTaxes;

  private addressMS: AxiosAddressMS;

  private consumerMS: AxiosConsumerMS;

  constructor(private cartUseCases: CartUseCases) {
    this.serviceRestClient = new AxiosServiceRestClient();
    this.taxRestClient = new AxiosTaxes();
    this.addressMS = new AxiosAddressMS();
    this.consumerMS = new AxiosConsumerMS();
  }

  // Carts
  public async getCart(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cart: ICartDTO = await this.cartUseCases.getCart(req.params.cartId);

      return res.status(200).json({
        data: cart,
        message: 'Get Single Cart Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getCartQuery(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const query: any = req.query;
      const cart = await this.cartUseCases.getCartByQuery(query);

      return res.status(200).json({
        data: cart,
        message: 'Get Carts Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async createCart(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const fixlersToken = req.headers['x-fixlers-token']?.toString() || '';
      const cart: ICartDTO = req.body;

      const consumer = await this.consumerMS.getConsumer(fixlersToken, cart.id);

      const createdCart: ICartDTO = await this.cartUseCases.createCart(
        cart,
        consumer
      );

      return res.status(201).json({
        data: createdCart,
        message: 'Cart Successfully Created!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateCart(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cart: ICartDTO = req.body;
      const cartId: string = req.params.cartId;

      const updatedCart: ICartDTO = await this.cartUseCases.updateCart(
        cart,
        cartId
      );

      return res.status(200).json({
        data: updatedCart,
        message: 'Cart Successfully Updated!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteCart(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;

      const deletedCart: ICartDTO = await this.cartUseCases.deleteCart(cartId);

      return res.status(200).json({
        data: deletedCart,
        message: 'Cart Successfully Deleted!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Cart Services
  public async createCartService(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const authToken = req.headers.authorization || '';
      const fixlersToken = req.headers.authorization?.split(' ')[1] || '';
      const cartId: string = req.params.cartId;

      // Create cart
      const cart: ICartDTO = { id: cartId } as ICartDTO;

      const consumer = await this.consumerMS.getConsumer(fixlersToken, cartId);

      await this.cartUseCases.createCart(cart, consumer);

      // Get service from another MicroService
      const service = await this.serviceRestClient.getService(
        authToken,
        fixlersToken,
        req.body.serviceId
      );

      // Save service to ArchidServiceObject
      await this.cartUseCases.createCartArchivedServiceObject(cartId, service);

      let cartService = req.body;
      cartService.id = service.id;
      cartService.serviceName = service.serviceName || '';
      cartService.thumbnail =
        service.category.length > 0 ? service.category[0].thumbnail : null;
      cartService.description = service.description || '';

      cartService = await this.cartUseCases.createCartService(
        cartId,
        cartService
      );

      const selectedCostUnits: ICostDetailRequestObj = {
        selectedCostUnits: []
      };

      const tax: IStateTax = await this.taxRestClient.getStateTax(
        authToken,
        'NY'
      );

      await this.cartUseCases.updateCostDetail(
        cartId,
        cartService.id,
        selectedCostUnits,
        tax
      );

      cartService.costDetail.isCustomQuoteJob = true;
      await this.cartUseCases.putCartService(cartId, cartService);

      return res.status(201).json({
        data: cartService,
        message: 'Created Cart and cartService Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getCartServices(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const services = await this.cartUseCases.getCartServices(
        req.params.cartId
      );

      return res.status(200).json({
        data: services,
        message: 'Retrieved Services Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateCartService(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      let cartService = req.body;

      cartService = await this.cartUseCases.updateCartService(
        cartId,
        serviceId,
        cartService
      );

      return res.status(200).json({
        data: cartService,
        message: 'Updated cart service successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getCartService(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const service = await this.cartUseCases.getCartService(
        req.params.cartId,
        req.params.serviceId
      );

      return res.status(200).json({
        data: service,
        message: 'Retrieved Cart Service Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteCartService(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const message = await this.cartUseCases.deleteCartService(
        req.params.cartId,
        req.params.serviceId
      );

      return res.status(200).json({
        data: message,
        message: 'Deleted Cart Service Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async insertJobMaterials(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const jobMaterial: JobMaterials = req.body;

      const cart = await this.cartUseCases.insertJobMaterials(
        cartId,
        serviceId,
        jobMaterial
      );

      return res.status(201).json({
        data: cart,
        message: 'Job Material Inserted Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateJobMaterial(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const materialId: string = req.params.materialId;
      const jobMaterials: JobMaterials = req.body;

      const cart = await this.cartUseCases.updateJobMaterial(
        cartId,
        serviceId,
        materialId,
        jobMaterials
      );

      return res.status(200).json({
        data: cart,
        message: 'Job Material Updated Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getJobMaterials(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const jobMaterials = await this.cartUseCases.getJobMaterials(
        req.params.cartId,
        req.params.serviceId
      );

      return res.status(200).json({
        data: jobMaterials,
        message: 'Retrieved Job Materials Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getJobMaterial(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const jobMaterials = await this.cartUseCases.getJobMaterial(
        req.params.cartId,
        req.params.serviceId,
        req.params.materialId
      );

      return res.status(200).json({
        data: jobMaterials,
        message: 'Retrieved Job Material Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteJobMaterial(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const jobMaterials = await this.cartUseCases.deleteJobMaterial(
        req.params.cartId,
        req.params.serviceId,
        req.params.materialId
      );

      return res.status(200).json({
        data: jobMaterials,
        message: 'Deleted Job Material Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Consumert Notes
  public async getConsumerNote(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const consumerNote = await this.cartUseCases.getConsumerNote(
        req.params.cartId,
        req.params.serviceId
      );

      return res.status(200).json({
        data: consumerNote,
        message: 'Retrieved Job Material Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateConsumerNote(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      let consumerNote: IConsumerNote = req.body;

      consumerNote = await this.cartUseCases.updateConsumerNote(
        cartId,
        serviceId,
        consumerNote
      );

      return res.status(200).json({
        data: consumerNote,
        message: 'Updated Consumer Note Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Cost Detail
  public async getCostDetail(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;

      const costDetail = await this.cartUseCases.getCostDetail(
        cartId,
        serviceId
      );

      return res.status(200).json({
        data: costDetail,
        message: 'Created Cost Detail Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateCostDetail(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const data: ICostDetailRequestObj = req.body;
      const authToken = req.headers.authorization || '';

      const tax: IStateTax = await this.taxRestClient.getStateTax(
        authToken,
        'NY'
      );

      const costDetail = await this.cartUseCases.updateCostDetail(
        cartId,
        serviceId,
        data,
        tax
      );

      return res.status(200).json({
        data: costDetail,
        message: 'Updated Cost Detail Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Prefered Timing
  public async getPreferredTiming(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;

      const data = await this.cartUseCases.getPreferredTiming(
        cartId,
        serviceId
      );

      return res.status(200).json({
        data,
        message: 'Get Preferred Timing Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updatePreferredTiming(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const preferedTiming: PreferredTiming = req.body;

      const data = await this.cartUseCases.updatePreferredTiming(
        cartId,
        serviceId,
        preferedTiming
      );

      return res.status(200).json({
        data,
        message: 'Updated Preferred Timing Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateJobAddress(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const authToken = req.headers['x-fixlers-token']?.toString() || '';
      const cartId: string = req.params.cartId;
      const payload = req.body;
      let jobAddress = {
        id: payload.id,
        relTo: {
          type: payload.type,
          attributes: payload.attributes
        }
      };

      if (features.USE_ADDRESS_MS) {
        const address = await this.addressMS.getConsumerAddress(
          authToken,
          jobAddress.id
        );
        jobAddress = address;
      }

      const cart = await this.cartUseCases.updateJobAddress(cartId, jobAddress);

      return res.status(200).json({
        data: cart,
        message: 'Update Job Address Successully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getJobAddress(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const cart = await this.cartUseCases.getJobAddress(cartId);

      return res.status(200).json({
        data: cart,
        message: 'Retrieved Job Address Successully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // CartService Quantity
  public async getQuantity(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;

      const costDetail = await this.cartUseCases.getQuantity(cartId, serviceId);

      return res.status(200).json({
        data: costDetail,
        message: 'Successfully Get Quantity!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateQuantity(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const quantity: number = req.body.quantity;

      const costDetail = await this.cartUseCases.updateQuantity(
        cartId,
        serviceId,
        quantity
      );

      return res.status(200).json({
        data: costDetail,
        message: 'Updated Quantity Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  // CartService Answers
  public async getAnswers(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;

      const answers = await this.cartUseCases.getAnswers(cartId, serviceId);

      return res.status(200).json({
        data: answers,
        message: 'Successfully Get Answers!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateAnswers(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const serviceId: string = req.params.serviceId;
      const answers: Answer[] = req.body;

      const updatedAnswers = await this.cartUseCases.updateAnswers(
        cartId,
        serviceId,
        answers
      );

      return res.status(200).json({
        data: updatedAnswers,
        message: 'Updated Answers Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async putCartService(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const cartId: string = req.params.cartId;
      const data = req.body;

      const cart = await this.cartUseCases.putCartService(cartId, data);

      return res.status(200).json({
        data: cart,
        message: 'Updated Cart Service Successfully!'
      });
    } catch (error: any) {
      next(error);
    }
  }
}
