import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const schema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = model<IUser>("User", schema);
