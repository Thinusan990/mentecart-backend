import { Response } from "express";
import Cart from "../models/Cart";
import Service from "../models/Service";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    return res.json(cart);
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

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item: any) =>
        item.serviceId.toString() === serviceId &&
        item.date === date &&
        item.timeSlot === timeSlot
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        serviceId,
        title: service.title,
        price: service.price,
        quantity,
        date,
        timeSlot,
      } as any);
    }

    cart.totalPrice = cart.items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(201).json(cart);
  } catch (error) {
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