import { Request, Response } from "express";
import { SportItemModel } from "../models/items";
import upload from "../initializers/multerSettup";
import { IItem } from "../types/items";

export class ItemsController {
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            // Use multer to handle the file uploads
            upload.array("upload", 10)(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { name, brand, price, desc, quantity, category } =
                    req.body;

                const imageUrls: string[] = req.files
                    ? (req.files as Express.Multer.File[]).map(
                          (file) => file.path
                      )
                    : [];

                const newItem = {
                    name,
                    brand,
                    price: parseFloat(price),
                    desc,
                    quantity: parseInt(quantity, 10),
                    category: category
                        .split(",")
                        .map((id: string) => parseInt(id.trim(), 10)),
                    imageUrl: imageUrls,
                };

                const savedItem = await SportItemModel.create(newItem);

                // Respond with the created item
                res.status(201).json(savedItem);
            });
        } catch (error) {
            console.error("Error creating item:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    async readByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const item = await SportItemModel.findById(id).select("-__v");
            if (!item) {
                res.status(404).json({
                    message: "Item with current ID not found",
                });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
    async readAll(req: Request, res: Response): Promise<void> {
        try {
            const items = await SportItemModel.find().select("-__v");
            if (!items) {
                res.status(404).json({ message: "Sport items not found" });
                return;
            }
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
    async updateByID(req: Request, res: Response): Promise<void> {
        try {
            upload.array("upload", 10)(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { id } = req.params; // Get the item ID from URL params
                const { name, brand, price, desc, quantity, category } =
                    req.body;

                // Process uploaded files
                const imageUrls: string[] = req.files
                    ? (req.files as Express.Multer.File[]).map((file) =>
                          file.path.replace(/\\/g, "/")
                      )
                    : [];

                const updateData: Partial<IItem> = {};

                if (name) updateData.name = name;
                if (brand) updateData.brand = brand;
                if (price) updateData.price = parseFloat(price);
                if (desc) updateData.desc = desc;
                if (quantity) updateData.quantity = parseInt(quantity, 10);
                if (category) {
                    updateData.category = category
                        .split(",")
                        .map((id: string) => parseInt(id.trim(), 10));
                }
                if (imageUrls.length > 0) updateData.imageUrl = imageUrls;

                const updatedItem = await SportItemModel.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                ).select("-__v"); 

                if (!updatedItem) {
                    return res.status(404).json({ message: "Item not found" });
                }

                res.status(200).json(updatedItem);
            });
        } catch (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async deleteByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const category = await SportItemModel.findByIdAndDelete(id);
            if (!category) {
                res.status(404).json({ message: "Items not found not found" });
                return;
            }

            res.json({ message: "Item deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
}
