import { Response, Request } from "express";
import { CardModel } from "../models/card"; // Adjust the path as necessary
import { SportItemModel } from "../models/items"; // Adjust the path as necessary
import mongoose from "mongoose";

export class CardController {
    // Add items to the card
    async add(req: Request, res: Response): Promise<void> {
        try {
            const { itemId, quantity } = req.body;

            // Find the sport item by ID
            const sportItem = await SportItemModel.findById(itemId);
            if (!sportItem) {
                res.status(404).json({ message: "Sport item not found" });
                return;
            }

            // Find the card, or create a new one if it doesn't exist
            let card = await CardModel.findOne();
            if (!card) {
                card = new CardModel({ items: [], totalPrice: 0 });
            }

            // Check if the item already exists in the card
            const existingItem = card.items.find(
                (item) => item.item.toString() === itemId
            );

            if (existingItem) {
                // If the item exists, update the quantity
                existingItem.quantity += quantity;
            } else {
                // Otherwise, add a new item
                card.items.push({ item: sportItem._id, quantity });
            }

            // Update the total price
            card.totalPrice += sportItem.price * quantity;

            await card.save();
            res.status(201).json(card);
        } catch (error) {
            console.error("Error adding item to card:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Get the card details
    async get(req: Request, res: Response): Promise<void> {
        try {
            // Fetch the card with populated items
            const card = await CardModel.findOne().populate("items.item");

            if (!card) {
                res.status(404).json({ message: "Card not found" });
                return;
            }

            // Create a deep copy of the card object
            const cardWithoutIds = card.toObject();

            // Remove unwanted fields from each item and include id
            (cardWithoutIds.items as any) = cardWithoutIds.items.map(
                (item: any) => {
                    return {
                        _id: item._id, // Retain the id of the item
                        ...item.item, // Spread the item details
                        quantity: item.quantity, // Retain the quantity
                    };
                }
            );

            // Send the modified card object
            res.status(200).json(cardWithoutIds);
        } catch (error) {
            console.error("Error retrieving card:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Update item quantities in the card
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { itemId, quantity } = req.body;

            // Fetch the card with populated items
            const card = await CardModel.findOne();
            if (!card) {
                res.status(404).json({ message: "Card not found" });
                return;
            }

            // Find the item to update
            const itemToUpdate = card.items.find((item) => {
                if (item._id) return item._id.toString() === itemId;
            });

            if (!itemToUpdate) {
                res.status(404).json({ message: "Item not found in card" });
                return;
            }

            // Find the sport item in the database
            const sportItem = await SportItemModel.findById(itemId);
            if (!sportItem) {
                res.status(404).json({ message: "Sport item not found" });
                return;
            }

            // Update the quantity and adjust the total price
            const oldTotal = itemToUpdate.quantity * sportItem.price;
            const newTotal = quantity * sportItem.price;
            card.totalPrice += newTotal - oldTotal;

            itemToUpdate.quantity = quantity;

            await card.save();
            res.status(200).json(card);
        } catch (error) {
            console.error("Error updating card:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Delete an item from the card
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params;
            // Convert itemId to ObjectId
            const itemObjectId = new mongoose.Types.ObjectId(itemId);
            
            // Find the card
            const card = await CardModel.findOne();
            if (!card) {
                res.status(404).json({ message: "Card not found" });
                return;
            }
            
            // Find the index of the item to delete
            console.log(itemId, card.items)
            const itemIndex = card.items.findIndex(
                (item) => item.item.toString() === itemObjectId.toString()
            );

            if (itemIndex === -1) {
                res.status(404).json({ message: "Item not found in card" });
                return;
            }

            // Get the sport item
            const sportItem = await SportItemModel.findById(itemObjectId);
            if (!sportItem) {
                res.status(404).json({ message: "Sport item not found" });
                return;
            }

            // Update total price
            card.totalPrice -= card.items[itemIndex].quantity * sportItem.price;

            // Remove the item
            card.items.splice(itemIndex, 1);

            // Save the updated card
            await card.save();
            res.status(200).json(card);
        } catch (error) {
            console.error("Error deleting item from card:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
