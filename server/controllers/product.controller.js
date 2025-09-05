import { request, response } from "express";
import ProductModel from "../models/product.model.js";

// Создание товара
export const createProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = request.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !stock ||
      !price ||
      !discount ||
      !description
    ) {
      return response.status(400).json({
        message: "Предоставьте все данные",
        error: true,
        success: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();

    return response.status(200).json({
      message: "Продукт успешно создан",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Получение товара
export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;

    if (!page) page = 2;

    if (!limit) limit = 10;

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.status(200).json({
      message: "Данные успешно получены",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Получение товара по категории
export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "Нет id",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(15);

    return response.status(200).json({
      message: "Список продуктов категории",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Получение товара по категории и подкатегории
export const getProductByCategoryAndSubcategory = async (request, response) => {
  try {
    let { categoryID, subCategoryID, page, limit } = request.body;

    console.log(categoryID, subCategoryID, page, limit);

    if (!categoryID || !subCategoryID) {
      return response.status(400).json({
        message: "Предоставьте categoryID, subCategoryID",
        error: true,
        success: false,
      });
    }

    if (!page) page = 1;

    if (!limit) limit = 10;

    const query = {
      category: { $in: categoryID },
      subCategory: { $in: subCategoryID },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return response.status(200).json({
      message: "Получен список товаров",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Получаем товар по ID
export const getProductDetails = async (request, response) => {
  try {
    const { categoryId } = request.body;

    const product = await ProductModel.findOne({ _id: categoryId });

    return response.status(200).json({
      message: "Товар получен",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Обновление товара по ID
export const updateProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Нет id товара",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...request.body,
      }
    );

    return response.status(200).json({
      message: "Товар успешно обновлен 🎉",
      error: false,
      success: true,
      data: updateProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Удаление товара по ID
export const deleteProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Нет _id для удаления товара",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return response.status(200).json({
      message: "Товар успешно удален",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Поиск товара
export const searchProduct = async (request, response) => {
  try {
    let { search, page, limit } = request.body;

    if (!page) page = 1;

    if (!limit) limit = 10;

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.status(200).json({
      message: "Данные поиска успешно получены",
      error: false,
      success: true,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      data: data,
      page: page,
      limit: limit
    });


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
