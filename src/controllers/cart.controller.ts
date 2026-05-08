import { Response } from "express";
import Cart from "../models/Cart";
import Service from "../models/Service";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const cart = await Cart.findOne({ user: req.userId });
console.log(req.body);
    return res.json({
  items: cart?.items || [],
  totalPrice: cart?.totalPrice || 0,
});

  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}

export async function addCartItem(
  req: AuthRequest,
  res: Response
) {
  try {

    const {
      serviceId,
      quantity,
      date,
      timeSlot,
    } = req.body;

    console.log(
      "ADD CART BODY => ",
      req.body
    );

    const service =
      await Service.findById(serviceId);

    if (!service) {

      return res.status(404).json({
        message: "Service not found",
      });
    }

    /// USER SPECIFIC CART
    let cart =
      await Cart.findOne({
        user: req.userId,
      });

    /// CREATE NEW CART FOR USER
    if (!cart) {

      cart = await Cart.create({

        user: req.userId,

        items: [],

        totalPrice: 0,
      });
    }

    /// ALWAYS PUSH NEW ITEM
    cart.items.push({

      serviceId: service._id,

      title: service.title,

      price: service.price,

      quantity: Number(quantity),

      date: String(date),

      timeSlot: String(timeSlot),
    } as any);

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
      "UPDATED CART => ",
      JSON.stringify(
        cart,
        null,
        2
      )
    );

    return res.status(201).json({

      message:
          "Item added to cart",

      items: cart.items,

      totalPrice:
          cart.totalPrice,
    });

  } catch (error) {

    console.log(
      "ADD CART ERROR => ",
      error
    );

    return res.status(500).json({
      message: "Failed",
    });
  }
}

export async function deleteCartItem(
  req: AuthRequest,
  res: Response
) {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item: any) => item._id.toString() !== req.params.itemId
    ) as any;

    cart.totalPrice = cart.items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}