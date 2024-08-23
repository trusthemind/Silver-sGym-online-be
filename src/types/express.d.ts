import { UserModel } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: UserModel;
        }
    }
}
