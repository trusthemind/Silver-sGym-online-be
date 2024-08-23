import { Request, Response } from "express";
import { CategoryModel } from "../models/category";

export class CategoryController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { code, name } = req.body;

            const existingCategory = await CategoryModel.findOne({ code });
            if (existingCategory) {
                res.status(400).json({
                    message: "Category with this code already exists, please make it unique",
                });
                return;
            }

            const category = new CategoryModel({ code, name });
            await category.save();

            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async readAll(req: Request, res: Response): Promise<void> {
        try {
            const categories = await CategoryModel.find().select("-__v");
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async readByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const category = await CategoryModel.findById(id).select("-__v");
            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            res.json(category);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const category = await CategoryModel.findByIdAndDelete(id);
            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            res.json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateByID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { code, name } = req.body;

            const category = await CategoryModel.findByIdAndUpdate(
                id,
                { code, name },
                { new: true }
            ).select("-__v");
            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            res.json(category);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
