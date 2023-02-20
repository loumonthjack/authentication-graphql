import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import {makeExecutableSchema} from '@graphql-tools/schema';
import { DocumentNode } from "graphql";

require("dotenv").config();

import typeDefs from "./schema";
import permissions from "./shield";
import resolvers from "./resolvers";
import config from "./config";

async function main(typeDefs: DocumentNode, resolvers: unknown) {
  const expressApp: Application = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.get("/", (req, res) => {
    res.redirect("/graphql");
  });
  const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers as any,
  });
  const graphQLServer = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    plugins: [
      httpHeadersPlugin,
    ],
    cache: "bounded",
    csrfPrevention: true,
    debug: !config.server.isProd,
    context: async ({ req, res }) => {
      const { authorization } = req.headers;
      let token = authorization ? authorization?.split(" ")[1] : null;
      return { token, setHeaders: [], setCookies: [], req, res };
    },
  });
  await graphQLServer.start();
  graphQLServer.applyMiddleware({ app: expressApp, cors: false, path: "/graphql" });
  expressApp.listen({ port: config.server.port });
  config.server.isLocal && console.log(`🚀 Server ready at http://localhost:${config.server.port}${graphQLServer.graphqlPath}`);
}

main(typeDefs, resolvers);
