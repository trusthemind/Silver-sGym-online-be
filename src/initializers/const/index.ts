type Role = "User" | "Administrator" | "User Manager";

export const GlobalRoles: { [key: string]: Role } = {
    USER: "User",
    ADMIN: "Administrator",
    MANAGER: "User Manager",
};
