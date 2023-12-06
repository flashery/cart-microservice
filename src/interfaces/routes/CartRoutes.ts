import { Router } from 'express';
import { CartController } from '../controllers/CartController';
export class CartRoutes {
  private router: Router;

  private cartController: CartController;

  constructor(cartController: CartController) {
    this.router = Router();
    this.cartController = cartController;
    this.initializeRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private initializeRoutes() {
    // Carts Routes
    this.router.get(
      '/carts/:cartId',
      this.cartController.getCart.bind(this.cartController)
    );
    this.router.get(
      '/carts',
      this.cartController.getCartQuery.bind(this.cartController)
    );
    this.router.post(
      '/carts',
      this.cartController.createCart.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId',
      this.cartController.updateCart.bind(this.cartController)
    );
    this.router.delete(
      '/carts/:cartId',
      this.cartController.deleteCart.bind(this.cartController)
    );
    // CartServices Routes
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId',
      this.cartController.getCartService.bind(this.cartController)
    );
    this.router.get(
      '/carts/:cartId/cartServices',
      this.cartController.getCartServices.bind(this.cartController)
    );
    this.router.post(
      '/carts/:cartId/cartServices',
      this.cartController.createCartService.bind(this.cartController)
    );
    this.router.patch(
      '/carts/:cartId/cartServices/:serviceId',
      this.cartController.updateCartService.bind(this.cartController)
    );
    this.router.delete(
      '/carts/:cartId/cartServices/:serviceId',
      this.cartController.deleteCartService.bind(this.cartController)
    );
    // Jobs Materials
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/jobMaterials',
      this.cartController.getJobMaterials.bind(this.cartController)
    );
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/jobMaterials/:materialId',
      this.cartController.getJobMaterial.bind(this.cartController)
    );
    this.router.post(
      '/carts/:cartId/cartServices/:serviceId/jobMaterials',
      this.cartController.insertJobMaterials.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/jobMaterials/:materialId',
      this.cartController.updateJobMaterial.bind(this.cartController)
    );
    this.router.delete(
      '/carts/:cartId/cartServices/:serviceId/jobMaterials/:materialId',
      this.cartController.deleteJobMaterial.bind(this.cartController)
    );
    // Carts.attributes.cartServices[].consumerNotes
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/consumerNotes/',
      this.cartController.getConsumerNote.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/consumerNotes/',
      this.cartController.updateConsumerNote.bind(this.cartController)
    );
    // Carts.attributes.cartServices[].costDetail
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/costDetails',
      this.cartController.getCostDetail.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/costDetails',
      this.cartController.updateCostDetail.bind(this.cartController)
    );
    // Carts.attributes.cartServices[].preferedTiming
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/preferredTiming',
      this.cartController.getPreferredTiming.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/preferredTiming',
      this.cartController.updatePreferredTiming.bind(this.cartController)
    );
    // Job Address
    this.router.put(
      '/carts/:cartId/relationships/jobAddress',
      this.cartController.updateJobAddress.bind(this.cartController)
    );
    this.router.get(
      '/carts/:cartId/relationships/jobAddress',
      this.cartController.getJobAddress.bind(this.cartController)
    );
    // Carts.attributes.cartServices[].quantity
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/quantities',
      this.cartController.getQuantity.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/quantities',
      this.cartController.updateQuantity.bind(this.cartController)
    );
    // Carts.attributes.cartServices[].answers
    this.router.get(
      '/carts/:cartId/cartServices/:serviceId/answers',
      this.cartController.getAnswers.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId/answers',
      this.cartController.updateAnswers.bind(this.cartController)
    );
    this.router.put(
      '/carts/:cartId/cartServices/:serviceId',
      this.cartController.putCartService.bind(this.cartController)
    );
  }
}
