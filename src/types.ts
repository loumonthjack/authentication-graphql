export type UserCreateInput = {
    name: string;
    email: string;
    password: string;
};

export type UserType = {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export type SessionCreateInput = {
    token: string;
    userId: string;
};

export type SessionType = {
    expiresAt: string | number | Date;
    id: string;
    userId: string;
    token: string;
};