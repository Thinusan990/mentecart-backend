import { Router } from "express";
import {
  checkout,
  getBookings,
  cancelBooking,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/checkout", protect, checkout);
router.get("/", protect, getBookings);
router.post("/:id/cancel", protect, cancelBooking);

export default router;