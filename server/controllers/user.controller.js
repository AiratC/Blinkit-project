import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "./../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

// Контроллер регистрации пользователя
export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Предоставьте name email password",
        error: true,
        success: false,
      });
    }

    // Находим пользователя в БД
    const user = await UserModel.findOne({ email });

    // Если пользователь найден то он уже зарегистрирован
    if (user) {
      return response.json({
        message: `Пользователь с email: ${email} уже зарегистрирован`,
        error: true,
        success: false,
      });
    }

    // Солим и хэшируем оригинальный пароль
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Формируем объект с хэшированным паролем
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // Добавляем и сохраняем объект в UserModel
    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    // Отправка письма на email для подтверждения почты
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Подтверждение почты от Fashion-Shop",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return response.json({
      message: "Пользователь успешно зарегистрирован",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Контроллер подтверждения электронной почты
export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    // Находим пользователя в БД
    const user = await UserModel.findOne({ _id: code });
    // Если пользователь не найден то отправляем ошибку
    if (!user) {
      return response.status(400).json({
        message: "Невалидный code",
        error: true,
        success: false,
      });
    }

    // Если пользователь найден то обновляем верификацию почты
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return response.json({
      message: "Верификация почты выполнена",
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
}

// Контроллер входа login
export async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Введите email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Пользователь не зарегистрирован",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Свяжитесь с администратором",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: "Неверный пароль",
        error: true,
        success: false,
      });
    }

    // Access Token будет жить 5 часов
    const accessToken = await generatedAccessToken(user._id);
    // Refresh Token будет жить 7 дней
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date()
    })

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Access Token будет жить 5 часов
    response.cookie("accessToken", accessToken, cookiesOptions);
    // Refresh Token будет жить 7 дней
    response.cookie("refreshToken", refreshToken, cookiesOptions);

    return response.status(200).json({
      message: "Вход успешно выполнен",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Контроллер выхода logout
export async function logoutController(request, response) {
  try {
    const userid = request.userId; // middleware

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookiesOptions);
    response.clearCookie("refreshToken", cookiesOptions);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return response.status(200).json({
      message: "Выход выполнен",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      messasge: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Контроллер загрузки аватарки
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const image = request.file; // multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return response.json({
      message: "upload profile",
      error: false,
      success: true,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      status: false,
    });
  }
}

// Контроллер обновление данных пользователя
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { name, email, mobile, password } = request.body;
    let hashPassword = "";

    if (password) {
      // Солим и хэшируем оригинальный пароль
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne({ _id: userId }, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashPassword }),
    });

    return response.status(200).json({
      message: `Данные пользователя успешно обновлены`,
      error: false,
      success: true,
      data: updateUser
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Контроллер - Забыл пароль, не могу войти
export async function forgotPasswordController(request, response) {
   try {
      const { email } = request.body;

      // Находим в БД пользователя по email
      const user = await UserModel.findOne({ email });

      // Если пользователь не найден то отправляем ошибку с ответом
      if(!user) {
         return response.status(400).json({
            message: `Пользователь с email : ${email}, не найден в БД`,
            error: true,
            success: false
         })
      };

      // Генерируем шестизначное число - КОД
      const otp = generatedOtp();
      const expireTime = new Date() + 60 * 60 * 1000 // 1 час

      // Находим пользователя в БД и обновляем forgot_password_otp / forgot_password_expiry
      const update = await UserModel.findByIdAndUpdate(user._id, {
         forgot_password_otp: otp,
         forgot_password_expiry: new Date(expireTime).toISOString()
      });

      await sendEmail({
         sendTo: email,
         subject: "Забыли пароль от fashion-shop",
         html: forgotPasswordTemplate({
            name: user.name,
            otp: otp
         })
      })


      return response.json({
         message: "Проверьте email",
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

// Контроллер проверить забытый пароль otp
export async function verifyForgotPasswordOtp(request, response) {
   try {
      const { email, otp } = request.body;

      if(!email || !otp) {
         return response.status(400).json({
            message: "Укажите обязательное поле email и otp",
            error: true,
            success: false
         })
      }

      // Находим в БД пользователя по email
      const user = await UserModel.findOne({ email });

      // Если пользователь не найден то отправляем ошибку с ответом
      if(!user) {
         return response.status(400).json({
            message: `Пользователь с email : ${email}, не найден в БД`,
            error: true,
            success: false
         })
      };

      const currentTime = new Date().toISOString();
      if(user.forgot_password_expiry < currentTime) {
         return response.status(400).json({
            message: "Срок действия одноразового Otp кода истек",
            error: true,
            success: false

         });
      };

      if(otp !== user.forgot_password_otp) {
         return response.status(400).json({
            message: "Неверный otp код",
            error: true,
            success: false
         })
      }

      // otp === user.forgot_password_otp

      const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
        forgot_password_otp: "",
        forgot_password_expiry: ""
      })

      return response.json({
         message: "Успешное подтверждение одноразового otp кода",
         error: false,
         success: true
      })




   } catch (error) {
      return response.status(500).json({
         message: error.messsage || error,
         error: true,
         success: false
      })
   }
}

// Контроллер сброс пароля
export async function resetPassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if(!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "email, newPassword, confirmPassword обязательные поля для ввода",
        error: true,
        success: false
      })
    }

    // Находим по email пользователя в БД
    const user = await UserModel.findOne({ email });

    if(!user) {
      return response.status(400).json({
        message: "Невалидный email, пользователь не найден в БД",
        error: true,
        success: false
      })
    };

    if(newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "Пароли не совпадают, проверьте корректность ввода",
        error: true,
        success: false
      });
    };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword
    });

    return response.status(200).json({
      message: "Пароль успешно обновлен",
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


// Refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1];

    if(!refreshToken) {
      return response.status(401).json({
        message: "Невалидный токен",
        error: true,
        success: false
      })
    }

    const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

    if(!verifyToken) {
      return response.status(401).json({
        message: "Срок действия токена истек",
        error: true,
        success: false
      });
    };

    console.log('verifyToken', verifyToken)
    const userId = verifyToken?.id;

    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookiesOptions);

    return response.status(200).json({
      message: "Новый accessToken успешно сгенерирован",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken
      }
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || message,
      error: true,
      success: false
    })
  }
}

// Получаем данные пользователя во время входа
export async function userDetails(request, response) {
  try {
    const userId = request.userId;

    const user = await UserModel.findById(userId).select('-password -refresh_token');

    if(!user) {
      return response.status(401).json({
        message: "Пользователь не найден",
        error: true,
        success: false
      })
    }

    return response.json({
      message: "Данные пользователя",
      data: user,
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: "Что то пошло не так",
      error: true,
      success: false
    })
  }
}