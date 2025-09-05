import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";
import { deleteCategoryController, updateCategoryController } from "../controllers/category.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create-sub-category", auth, addSubCategoryController);
subCategoryRouter.post("/get-sub-category", getSubCategoryController);
subCategoryRouter.put("/update-sub-category", auth, updateSubCategoryController);
subCategoryRouter.delete('/delete-sub-category', auth, deleteSubCategoryController)

export default subCategoryRouter;
