import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const User = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        roles: [{ type: String, ref: "Role" }],
    },
    {
        timestamps: true,
    }
);

export const UserModel = model<IUser>("User", User);

export { User };
