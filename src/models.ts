import prisma from "../prisma/client";
import cuid from "cuid";
import { SessionCreateInput, SessionType, UserCreateInput, UserType } from "./types";
const session = prisma.session;
const user = prisma.user;

class SessionModel {
    async create(data: SessionCreateInput): Promise<SessionType> {
        return await session.create({
            data: {
                ...data,
                id: `ssn_${cuid()}`,
                createdAt: new Date(),
                expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            },
        });
    }
    async getByToken(token: string): Promise<SessionType | null> {
        return await session.findUnique({
            where: { token },
        });
    }
    async deleteByToken(token: string): Promise<SessionType | null> {
        return await session.delete({
            where: { token },
        });
    }
    async deleteByUserId(userId: string): Promise<Boolean> {
        const sessions = await session.deleteMany({
            where: { userId },
        });
        return sessions.count > 0;
    }
    async getAll(): Promise<SessionType[]> {
        return await session.findMany();
    }
    async delete(id: string): Promise<SessionType | null> {
        return await session.delete({
            where: { id },
        });
    }
}
const Session = new SessionModel();

class UserModel {
    async getByToken(token: SessionType["token"]): Promise<UserType | null> {
        const session = await Session.getByToken(token);
        if (!session) {
            return null;
        }
        return await user.findUnique({
            where: { id: session.userId },
        });
    }
    async get(id: string): Promise<UserType | null> {
        return await user.findUnique({
            where: { id },
        });
    }
    async secureGet(id: string): Promise<UserType & {
        password: string;
    }> {
        const userWithPassword = await user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!userWithPassword) throw new Error("User not found");
        return userWithPassword;
        
    }
    async create(data: UserCreateInput): Promise<UserType> {
        return await user.create({
            data: {
                ...data,
                id: `usr_${cuid()}`,
                createdAt: new Date()
            }
        });
    }
    async delete(id: string): Promise<UserType | null> {
        return await user.delete({
            where: { id },
        });
    }
    async update(id: string, data: UserCreateInput): Promise<UserType | null> {
        return await user.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    async getAll(): Promise<UserType[]> {
        return await user.findMany();
    }
    async getByEmail(email: string): Promise<UserType | null> {
        return await user.findUnique({
            where: { email },
        });
    }
}
const User = new UserModel();

export { User, Session };