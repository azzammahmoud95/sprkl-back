import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

// ------------ ADD USER  ---------- //
export async function addUsers(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validate input data
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(201).json({ message: "User added successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add user" });
    }
}

// ------------ GET USERS  ---------- //
export async function getUsers(req, res) {
    try {
        const { search, sortType, sortOrder } = req.query;

        // Validate sortType and sortOrder
        if ((sortType && !sortOrder) || (!sortType && sortOrder)) {
            return res.status(400).json({
                message: "Both sortType and sortOrder are required together",
            });
        }

        // Fetch users based on search || filter
        const users = await prisma.users.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                    ],
                }),
            },
            orderBy: sortType
                ? { [sortType]: sortOrder || "asc" }
                : { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Send the response with the list of users
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
}

// ------------ GET USER BY ID ---------- //
export async function getUserById(req, res) {
    try {
        const { id } = req.params;

        // Fetch user by id or throw an error if not found
        const user = await prisma.users.findUniqueOrThrow({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        if (error.name === "NotFoundError") {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Failed to retrieve user" });
        }
    }
}

// ------------ UPDATE USER BY ID ---------- //
export async function updateUser(req, res) {
    try {
        const { email, name } = req.body;
        const { id } = req.params;

        // Check if the user exists
        const existingUser = await prisma.users.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update the user in the database
        const updatedUser = await prisma.users.update({
            where: { id: id },
            data: { email: email, name: name },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Send a successful response
        res.status(200).json({
            message: "User updated successfully",
            updatedUser,
        });
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Failed to update user" });
        }
    }
}


export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        // Check if the user exists
        const existingUser = await prisma.users.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Delete the user in the database
        const deletedUser = await prisma.users.delete({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Send a successful response
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Failed to update user" });
        }
    }
}
