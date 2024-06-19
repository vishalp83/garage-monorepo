import { appFactory } from '@garage/api/ts-express-api';
import { Application } from 'express';
import pino from 'pino';
import { UserHandler } from './handlers/user';

/**
 * Setup the API app. Returns a configured express application instance.
 * @param env Environment name
 */
export function setup(): Application {
  const logger = pino({
    level: "info"
  });

  const userLookupHandler = new UserHandler();

  const app = appFactory({
    handlers: [userLookupHandler],
  });

  return app;
}
