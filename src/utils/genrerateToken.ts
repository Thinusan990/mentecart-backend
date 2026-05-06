import jwt, { Secret, SignOptions } from "jsonwebtoken";

export function generateToken(userId: string): string {
  const secret: Secret = process.env.JWT_SECRET || "fallback_secret";

  const options: SignOptions = {
    expiresIn: "1d",
  };

  return jwt.sign(
    { userId },
    secret,
    options
  );
}