import mongoose from "mongoose";

const categoryShema = new mongoose.Schema({
   name: {
      type: String,
      default: ''
   },
   image: {
      type: String,
      default: ''
   }
}, {
   timestamps: true
})

const CategoryModel = mongoose.model("category", categoryShema);

export default CategoryModel;