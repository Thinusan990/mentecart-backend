import { Response } from "express";
import Cart from "../models/Cart";
import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";

export async function checkout(
  req: AuthRequest,
  res: Response
) {
  try {

    const {
      selectedItems,
      paymentMethod,
      status,
    } = req.body;

    const cart =
      await Cart.findOne({
        user: req.userId,
      });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });
    }

    /// GET ONLY SELECTED ITEMS
    const checkoutItems =
        cart.items.filter(
      (item: any) =>
        selectedItems.includes(
          item._id.toString()
        )
    );

    if (!checkoutItems.length) {

      return res.status(400).json({
        message:
            "No items selected",
      });
    }

    /// CALCULATE TOTAL
    const total =
        checkoutItems.reduce(

      (sum: number, item: any) =>

        sum +
        item.price * item.quantity,

      0
    );

    /// CREATE BOOKING
   const booking =
    await Booking.create({

  user: req.userId,

  items: checkoutItems,

  totalPrice: total,

  paymentMethod,

  status,
});
    /// REMOVE ONLY CHECKED OUT ITEMS
    cart.items = cart.items.filter(
      (item: any) =>

        !selectedItems.includes(
          item._id.toString()
        )
    ) as any;

    /// RECALCULATE TOTAL
    cart.totalPrice =
        cart.items.reduce(

      (sum: number, item: any) =>

        sum +
        item.price * item.quantity,

      0
    );

    await cart.save();

    console.log(
      "BOOKING CREATED => ",
      JSON.stringify(
        booking,
        null,
        2
      )
    );

    return res.status(201).json({

      message:
          "Booking successful",

      booking,
    });

  } catch (error) {

    console.log(
      "CHECKOUT ERROR => ",
      error
    );

    return res.status(500).json({
      message:
          "Checkout failed",
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