import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { GlobalRoles } from "../initializers/const";

export class AuthController {
    // Registration
    async registration(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, password, roles } = req.body;

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 14);

            // Create new user
            const user = new UserModel({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                roles: [GlobalRoles.USER],
            });
            console.log(user);
            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Login
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, roles: user.roles },
                process.env.JWT_SECRET!,
                { expiresIn: "2h" }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({
                    message: "Access token is missing or invalid",
                });
                return;
            }

            const token = authHeader.split(" ")[1];

            let userId: string;
            try {
                const decodedToken = jwt.verify(
                    token,
                    process.env.JWT_SECRET!
                ) as jwt.JwtPayload;
                userId = decodedToken.userId;
            } catch (error) {
                res.status(403).json({ message: "Access token is invalid" });
                return;
            }

            const user = await UserModel.findById(userId)
                .select("-password")
                .select("-__v"); // Exclude field
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (user) res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
