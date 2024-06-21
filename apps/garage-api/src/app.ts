import { appFactory } from '@garage/ts-express-api';
import { Application } from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import pino from 'pino';
import { UserHandler } from './handlers/user';


const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      failOnErrors: true,
      info: {
          title: 'Garage API',
          description: 'Garage API Information',
          version: "1.0.0",
          contact: {
              name: 'Vishal Patel'
          },
      },
      servers: [
          {
              url: "http://localhost:3000/api"
          }
      ],
  },
  apis: ['./apps/garage-api/src/handlers/*.ts']
}


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

  if(process.env['NODE_ENV'] !== 'production') {
    const swaggerDocs = swaggerjsdoc(swaggerOptions)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }))
  }
  
  return app;
}


