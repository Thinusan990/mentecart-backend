import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
items: any[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   items: {
  type: [],
  required: true,
},
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "failed",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "cash",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>("Booking", bookingSchema)