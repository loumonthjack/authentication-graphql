import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Query {
        whoami: User
    }
    type Mutation {
        register(name: String!, email: String!, password: String!): User 
        login(email: String!, password: String!): Token
    }
    type User {
        id: String!
        name: String
        email: String
        createdAt: String
        updatedAt: String
    }
    type Token {
        token: String
    }
`;

export default typeDefs;