import { Response } from "express";
import Cart from "../models/Cart";
import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";

export async function checkout(
  req: AuthRequest,
  res: Response
) {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const booking = await Booking.create({
      user: req.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: "confirmed",
      paymentMethod: "cash",
      paymentStatus: "not_required",
    });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      message: "Checkout failed",
    });
  }
}

export async function getBookings(
  req: AuthRequest,
  res: Response
) {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}

export async function cancelBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}