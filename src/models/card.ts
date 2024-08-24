import { Schema, Types, model } from "mongoose";

const CardItemShema = new Schema(
    {
        item: { type: Types.ObjectId, ref: "Items", required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
);

const CardSchema = new Schema(
    {
        items: [CardItemShema],
        totalPrice: { type: "number",default: 0},
    },
    { timestamps: true }
);

export const CardModel = model("Card", CardSchema);
