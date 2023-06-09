import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4"
import { authMiddleware, handleLogin } from './auth.js';
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js"
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

async function getContext({ req }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  console.log('req. auth: ', req.auth)
  if (req.auth) {
    const user = await getUser(req.auth.sub)
    context.user = user;
  }
  return context;
}

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
});
