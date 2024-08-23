import { Schema, model } from "mongoose";

const UserRoleSchema = new Schema({
    value: { type: String, unique: true, reqired: true, default: "User" },
});
export const RoleModel = model("Role", UserRoleSchema);

// Export the schema if needed
export { UserRoleSchema };
