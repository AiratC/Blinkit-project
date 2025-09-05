import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGODB_URI) {
   throw new Error(
      "Укажите MONGODB_URI в файле .env"
   )
};

async function connectDB() {
   try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Успешное подключение к БД MONGODB");
   } catch (error) {
      console.log("Ошибка подключения в MONGODB", error);
      process.exit(1);
   }
}

export default connectDB;