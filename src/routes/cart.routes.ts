import { Router } from "express";
import {
  getCart,
  addCartItem,
  deleteCartItem,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getCart);
router.post("/items", protect, addCartItem);
router.delete("/items/:itemId", protect, deleteCartItem);

export default router;