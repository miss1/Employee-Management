const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const connectDB = require('./db');
const authMiddleware = require('./middlewares/auth');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = authMiddleware(req);
      return {
        user
      };
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  connectDB();

  app.listen(process.env.PORT, () => console.log(`Server is ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));
};

startServer();
