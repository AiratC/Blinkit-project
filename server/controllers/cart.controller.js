import { request } from "express";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

// Добавление товара в корзину
export const addToCartController = async (request, response) => {
  try {
    // ID пользователя
    const userId = request.userId;

    // ID товара
    const { productId } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Предоставьте ID товара",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Товар уже в корзине",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const cartItemSave = await cartItem.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );

    return response.status(200).json({
      data: cartItemSave,
      message: "Товар добавлен в корзину",
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

// Получаем товары корзины
export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    const cartItem = await CartProductModel.find({
      userId: userId,
    }).populate("productId");

    return response.status(200).json({
      data: cartItem,
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

// Обновление кол-во товаров в корзине
export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, quantity } = request.body;

    if (!_id || !quantity) {
      return response.status(400).json({
        message: "Предоставьте _id, quantity",
      });
    }

    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: quantity,
      }
    );

    return response.status(200).json({
      message: "Кол-во успешно обновлено",
      data: updateCartItem,
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

export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Предоставьте _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    return response.status(200).json({
      message: "Товар удален из 🛒",
      error: false,
      success: true,
      data: deleteCartItem
    });

    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
