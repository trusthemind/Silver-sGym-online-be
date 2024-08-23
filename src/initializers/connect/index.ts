import mongoose from "mongoose";

export const Connect = async () => {
    const dbUri = process.env.DB_URL ?? "";

    try {
        await mongoose.connect(dbUri);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Failed to connect to DB", error);
        process.exit();
    }
};

export const Disconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from DB");
    } catch (error) {
        console.error("Failed to disconnect from DB", error);
    }
};
