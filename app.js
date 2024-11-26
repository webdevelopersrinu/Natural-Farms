import express from "express";
import cros from "cors";
import xss from "xss-clean";
import helmet from "helmet";
import morgan from "morgan";
import sanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import connectCloudinary from "./config/cloudinary.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import CustomError from "./utils/CustomError.js";

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cros());
app.use(helmet());
app.use(sanitize());
app.use(xss());
app.use(morgan("dev"));
// rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // 100 requests per 15 minutes
app.use(limiter);

connectCloudinary();

app.get("/", (req, res) => {
  res.status(200).send("welcome to natural farms");
});

app.all("*", (req, res, next) => {
  let err = new CustomError(`this page ${req.originalUrl} is not found!`, 404);
  next(err);
});

app.use(globalErrorHandler);

export default app;
