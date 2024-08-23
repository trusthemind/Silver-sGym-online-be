import { Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string[];
}

export interface IDecodedToken {
    userId: string;
    roles: string[];
    iat: number;
    exp: number;
}
