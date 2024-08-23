import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IDecodedToken } from "../types/user";
import { GlobalRoles } from "../initializers/const";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as IDecodedToken;

            console.log(decodedToken.roles);
            if (
                decodedToken.roles &&
                decodedToken.roles.includes(GlobalRoles.ADMIN)
            ) {
                req.user = decodedToken;
                next();
            } else {
                res.status(403).json({ message: "Access denied" }); // Forbidden
            }
        } catch (error) {
            res.status(403).json({ message: "Access token is invalid" });
        }
    } else {
        res.status(401).json({ message: "Access token is missing" }); // Unauthorized
    }
};
