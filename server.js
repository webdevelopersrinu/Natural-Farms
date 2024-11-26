process.on("uncaughtException", (err) => {
  console.log("Error Name:- ", err.name);
  console.log("Error Message:- ", err.message);
  console.log("Error Stack:-", err.stack);
  console.log("handeling uncaught Exception shutting down....");
  server.close(() => {
    process.exit(1);
  });
});

import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";
import winston from "winston";

mongoose
  .connect(process.env.DB_CON_STR)
  .then(() => console.log("db Conection is success..."))
  .catch(() =>
    console.log("db Conection is not success something went worng...")
  );

const PORT = process.env.PORT || 5678;
const server = app.listen(PORT, () => {
  console.log("server start runing....");
});

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  server.close(() => process.exit(1));
});
