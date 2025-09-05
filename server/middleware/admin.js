import UserModel from "../models/user.model.js";

const admin = async (request, response, next) => {
  try {
    console.log("request.userId: ", request);
    const userId = request.userId;

    const user = await UserModel.findById(userId);

    if (user.role !== "ADMIN") {
      return response.status(400).json({
        message: "Отказ в разрешении",
        error: true,
        success: false,
      });
    }

    next();

  } catch (error) {
    return response.status(500).json({
      message: "Отказ в разрешении",
      error: true,
      success: false,
    });
  }
};

export default admin;
