import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { typeDefs } from './schema/typeDefs';
import { itemResolvers } from './resolvers/itemResolvers';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import logger from './utils/logger';

const PORT = parseInt(process.env['PORT'] ?? '4000', 10);
const CORS_ORIGINS = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

async function start(): Promise<void> {
  const app = express();
  const httpServer = http.createServer(app);

  // Security middleware
  app.use(
    helmet({
      // Allow Apollo Sandbox iframe in dev
      contentSecurityPolicy: process.env['NODE_ENV'] === 'production' ? undefined : false,
    })
  );

  app.use(
    cors({
      origin: CORS_ORIGINS,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'base-application-server' });
  });

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: itemResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {
      context: () => Promise.resolve({}),
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  httpServer.listen({ port: PORT, host: '127.0.0.1' }, () => {
    logger.info(`Server ready at http://127.0.0.1:${PORT}`);
    logger.info(`GraphQL endpoint: http://127.0.0.1:${PORT}/graphql`);
  });
}

start().catch((err: unknown) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});

// Made with Bob
