import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateToken } from "../utils/genrerateToken";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Signup failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
}
export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}