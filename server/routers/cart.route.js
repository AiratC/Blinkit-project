import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToCartController,
  deleteCartItemQtyController,
  getCartItemController,
  updateCartItemQtyController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add-to-cart", auth, addToCartController);
cartRouter.get("/get-cart-item", auth, getCartItemController);
cartRouter.put("/update-cart-quantity", auth, updateCartItemQtyController);
cartRouter.delete("/delete-cart-product", auth, deleteCartItemQtyController);

export default cartRouter;
