import { request, response } from "express";
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

// создание и добавление адреса в БД
export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { address_line, city, state, pincode, country, mobile } =
      request.body;

    const createdAddress = new AddressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId: userId
    });

    const saveAddress = await createdAddress.save();

    const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    return response.status(200).json({
      message: "Адрес успешно создан 🏘",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Получение адреса
export const getAddressController = async (request, response) => {
   try {
      const userId = request.userId;

      const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 });

      return response.status(200).json({
         message: "Список адресов",
         error: false,
         success: true,
         data: data
      });

   } catch (error) {
      return response.status(500).json({
         message: error.message || message,
         error: true,
         success: false
      })
   }
};

// Обновление адреса
export const updateAddressController = async (request, response) => {
   try {
      const userId = request.userId;
      const { _id, address_line, city, state, pincode, country, mobile } = request.body;

      const updateAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
         address_line, city, state, pincode, country, mobile
      });

      return response.status(200).json({
         message: "Адрес успешно обновлен",
         error: false,
         success: true,
         data: updateAddress
      });


   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}


// Удаляем адрес
export const disableAddressController = async (request, response) => {
   try {
      const userId = request.userId;
      const { _id } = request.body;

      const disableAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
         status: false
      });

      return response.status(200).json({
         message: "Адрес удален",
         error: false,
         success: true,
         data: disableAddress
      });

   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}

