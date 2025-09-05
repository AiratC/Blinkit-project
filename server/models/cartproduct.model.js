import mongoose from "mongoose";

const cartProductShema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'product'
   },
   quantity: {
      type: Number,
      default: 1
   },
   userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   }
}, {
   timestamps: true
});

const CartProductModel = mongoose.model('cartProduct', cartProductShema);

export default CartProductModel;