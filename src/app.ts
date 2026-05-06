import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import serviceRoutes from "./routes/service.routes";
import cartRoutes from "./routes/cart.routes";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "MenteCart API Running",
  });
});

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/cart", cartRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI as string).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});