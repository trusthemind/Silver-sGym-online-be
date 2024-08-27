import express from "express";
import { config } from "dotenv";
import { Connect } from "./src/initializers/connect";
import authRoutes from "./src/router/auth";
import uploadRoute from "./src/router/upload";
import cardRoute from "./src/router/card";
import CategoryRoutes from "./src/router/category";
import itemRoutes from "./src/router/items";
import path from "path";
import cors from "cors";
config();

const app = express();
const port = process.env.PORT ?? 3000;
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    })
);
app.use(express.json());

const init = async (app: express.Application) => {
    try {
        await Connect();
        app.listen(port, () => {
            console.log(
                `[SERVER]: Server is running at http://localhost:${port}`
            );
        });
    } catch (error) {
        console.error("Failed to initialize the server", error);
    }
};

init(app);

app.get("/", (_, res) => res.send("Service for online shop of sport items"));
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", uploadRoute);
app.use("/auth", authRoutes);
app.use("/category", CategoryRoutes);
app.use("/card", cardRoute);
app.use("/items", itemRoutes);
