import SubCategoryModel from "../models/subCategory.model.js";

export async function addSubCategoryController(request, response) {
   try {
      const { name, image, category } = request.body;

      if(!name || !image || !category[0]) {
         return response.status(400).json({
            message: "Предоставьте name, image, category",
            error: true,
            success: false
         });
      };

      const payload = {
         name,
         image,
         category
      };

      const createSubCategory = new SubCategoryModel(payload);
      const save = await createSubCategory.save();

      return response.status(200).json({
         message: `Подкатегория ${name} создана`,
         data: save,
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
};

export async function getSubCategoryController(request, response) {
   try {
      const data = await SubCategoryModel.find().sort({ createdAt: -1 }).populate('category');

      return response.status(200).json({
         message: "Подкатегории успешно получены",
         data: data,
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
};

export async function updateSubCategoryController(request, response) {
   try {
      const { _id, name, image, category } = request.body;

      if(!_id || !name || !image || !category[0]) {
         return response.status(400).json({
            message: "Предоставьте _id, name, image, category",
            error: true,
            success: false
         });
      };

      const checkSubCategory = await SubCategoryModel.findById(_id);

      if(!checkSubCategory) {
         return response.status(400).json({
            message: "Проверьте _id",
            error: true,
            success: false
         });
      };

      const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
         name,
         image,
         category
      });

      return response.status(200).json({
         message: "Успешное обновление подкатегории",
         data: updateSubCategory,
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

export async function deleteSubCategoryController(request, response) {
   try {
      const { _id } = request.body;

      const deleteSubcategory = await SubCategoryModel.findByIdAndDelete(_id);

      return response.status(200).json({
         message: "Подкатегория удалена",
         data: deleteSubcategory,
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