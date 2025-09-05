import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";


export const AddCategoryController = async (request, response) => {
   try {
      const { name, image } = request.body;

      if(!name || !image) {
         return response.status(400).json({
            message: "Предоставьте name и image",
            error: true,
            success: false
         })
      };

      const addCategory = await CategoryModel({
         name,
         image
      })

      const saveCategory = await addCategory.save();

      if(!saveCategory) {
         return response.status(500).json({
            message: "Категория не добавлена, не создана",
            error: true,
            success: false
         });
      };

      return response.status(200).json({
         message: "Категория добавлена",
         data: saveCategory,
         error: false,
         success: true
      });


   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}

export const getCategoryController = async (request, response) => {
   try {
      const data = await CategoryModel.find().sort({ createdAt: -1 });

      return response.status(200).json({
         data: data,
         error: false,
         success: true
      });
      
   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      });
   }
}

export const updateCategoryController = async (request, response) => {
   try {
      const { _id, name, image } = request.body;

      const update = await CategoryModel.updateOne({
         _id: _id
      }, {
         name,
         image
      });

      return response.status(200).json({
         message: "Категория обновлена",
         error: false,
         success: true,
         data: update
      });


   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
};

export const deleteCategoryController = async (request, response) => {
   try {
      const { _id } = request.body;

      const checkSubCategory = await SubCategoryModel.find({
         category: {
            "$in": [ _id ]
         }
      }).countDocuments();

      console.log(`checkSubCategory: `, checkSubCategory)


      const checkProduct = await ProductModel.find({
         category: {
            "$in": [ _id ]
         }
      }).countDocuments();

      console.log(`checkProduct: `, checkProduct)

      if(checkSubCategory > 0 || checkProduct > 0) {
         return response.status(400).json({
            message: "Категория уже используется, удалить нельзя.",
            error: true,
            success: false
         });

      };

      const deleteCategory = await CategoryModel.deleteOne({
         _id: _id
      });

      return response.status(200).json({
         message: "Категория успешно удалена",
         data: deleteCategory,
         error: false,
         success: true
      })


   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}