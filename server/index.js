import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./routers/user.route.js";
import categoryRouter from "./routers/category.route.js";
import uploadRouter from "./routers/upload.route.js";
import subCategoryRouter from "./routers/subCategory.route.js";
import productRouter from "./routers/product.route.js";
import cartRouter from "./routers/cart.route.js";
import addressRouter from "./routers/address.route.js";
import orderRouter from "./routers/order.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 8000;

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/sub-category', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

connectDB().then(
  app.listen(PORT, (error) => {
    if (error) {
      console.log(`Ошибка при запуске сервера, ${error}`);
    }

    console.log(`Серевер запущен на порту ${PORT}`);
  })
);
