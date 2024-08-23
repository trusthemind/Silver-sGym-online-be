import { Schema, model } from "mongoose";
import { ICategory } from "../types/category";

const CategorySchema = new Schema({
    code: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
});

export const CategoryModel = model<ICategory>("Category", CategorySchema);

export { CategorySchema as Category };
