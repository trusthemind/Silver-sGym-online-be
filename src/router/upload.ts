import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const UploadController = (req: Request, res: Response) => {
    const imageId = req.params.id;
    console.log(req.params.id);
    const imagePath = path.join(__dirname, "..", "uploads", imageId);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Serve the image file
        res.sendFile(imagePath);
    });
};

router.get("/:id", UploadController);

export default router;
