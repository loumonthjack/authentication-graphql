import { User, Session } from './models';
import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SessionType, UserType } from './types';
import config from './config';

const resolvers = {
    Query: {
        whoami: async (parent: any, args: any, ctx: { token: string; }, info: any) => {
            try {
                const user = await User.getByToken(ctx.token);
                if (!user) {
                    throw new Error("Not authenticated");
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            } catch (error) {
                const { message } = error as Error;
                config.logger(message)
                throw new Error(message);
            }
        },
    },
    Mutation: {
        register: async (parent: any, args: { name: string; email: string; password: string; }, ctx: any, info: any): Promise<UserType> => {
            try {
                const { name, email, password } = args;
                const schema = z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(8),
                });
                const data = schema.parse({ name, email, password });
                data.name = data.name.toLowerCase().trim();
                data.email = data.email.toLowerCase();
                data.password = bcrypt.hashSync(data.password, 10);
                if (await User.getByEmail(data.email)) {
                    return {
                        id: "Email already exists",
                        name: null,
                        email: null,
                        createdAt: null,
                        updatedAt: null,
                    };
                }
                return User.create(data);
            } catch (error) {
                const { message } = error as Error;
                config.logger(message)
                throw new Error(message);
            }
        },
        login: async (parent: any, args: { email: string; password: string; }, ctx: any, info: any): Promise<Partial<SessionType>> => {
            try {
                const { email, password } = args;
                const schema = z.object({
                    email: z.string().email(),
                    password: z.string().min(8),
                });
                const data = schema.parse({ email, password });
                const user = await User.getByEmail(data.email.toLowerCase());
                if (!user) {
                    return { token: "User not found" };
                }
                const securedUser = await User.secureGet(user.id);
                if (!bcrypt.compareSync(data.password, securedUser.password)) {
                    return { token: "Invalid password" };
                }
                const token = jwt.sign({ id: securedUser.id }, config.jwt.secret, {
                    expiresIn: "1d",
                });
                await Session.create({
                    userId: securedUser.id,
                    token,
                });
                return {token};
            } catch (error) {
                const { message } = error as Error;
                config.logger(message)
                throw new Error(message);
            }
        },
    },
};
export default resolvers;