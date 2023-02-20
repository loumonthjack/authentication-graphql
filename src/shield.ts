import { rule, shield, and, or } from "graphql-shield";
import { Session } from "./models";
import config from "./config";

const deleteExpiredSessions = async () => {
    const sessions = await Session.getAll();
    const now = new Date();
    sessions.forEach(async (session) => {
        const expiresAt = new Date(session.expiresAt);
        if (expiresAt < now) {
            await Session.delete(session.id);        
            config.logger(`Deleted expired session ${session.id}`);
        }
    });
};
setInterval(deleteExpiredSessions, 30 * 1000);

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.token !== null;
});
export default shield({
    Query: {
        whoami: isAuthenticated,
    }
});