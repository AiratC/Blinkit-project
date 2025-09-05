import { Router } from "express";
import auth from "../middleware/auth.js";
import { 
   cashOnDeliveryOrderController, 
   getOrdersDetails, 
   paymentController, 
   webhookStripe
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post('/cash-on-delivery', auth, cashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);
orderRouter.post('/webhook', webhookStripe);
orderRouter.get('/get-order-details', auth, getOrdersDetails);

export default orderRouter;