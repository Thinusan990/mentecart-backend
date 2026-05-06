import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
  serviceId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  date: string;
  timeSlot: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
        title: String,
        price: Number,
        quantity: Number,
        date: String,
        timeSlot: String,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICart>("Cart", cartSchema);