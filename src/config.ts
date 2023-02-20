const config = {
    server: {
        port: process.env.PORT || 4000,
        isProd: process.env.NODE_ENV === "production",
        isLocal: process.env.NODE_ENV === "local" || !process.env.NODE_ENV,
    },
    logger: (message: string | Error) => {
        if (config.server.isLocal) {
            console.log(message);
        }
        //  TODO: Add logging service (datadog, sentry, etc.)
    },
    jwt: {
        secret: process.env.JWT_SECRET || "secret",
    },
}

export default config;