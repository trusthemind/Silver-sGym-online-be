import { Schema, model } from "mongoose";
import { IItem } from "../types/items";

const SportItemSchema = new Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: String, required: true },
        desc: { type: String, required: true },
        quantity: { type: Number, required: true },
        category: [{ type: Number, ref: "Category", required: true }],
        imageUrl: [{ type: String, required: true }],
    },
    {
        timestamps: true,
    }
);

export const SportItemModel = model<IItem>("Items", SportItemSchema);

export { SportItemSchema };
