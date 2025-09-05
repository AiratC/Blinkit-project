import { Router } from "express";
import auth from "../middleware/auth.js";
import { 
   addAddressController, 
   disableAddressController, 
   getAddressController, 
   updateAddressController 
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post('/add-address', auth, addAddressController);
addressRouter.get('/get-address', auth, getAddressController);
addressRouter.put('/update-address', auth, updateAddressController);
addressRouter.delete('/disable-address', auth, disableAddressController);

export default addressRouter;