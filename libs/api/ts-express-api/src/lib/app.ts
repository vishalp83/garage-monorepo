import express, { Router } from "express";
import helmet from "helmet";
import pino from "pino-http";
import { defaultOptions, Options, SettingKeys } from "./options";

/**
 * Returns an express instance configured with basic settings such as logging,
 * cookies, JSON body parsing, security settings, healthcheck route, and JWT
 * auth middleware.
 * @param opts Configure the instance
 * @returns Express app instance
 */
export function appFactory(opts?: Partial<Options>) {
  const { apiPrefix, handlers, cookieName, helmetConfig, jwtConfig } = {
    ...defaultOptions,
    ...opts,
  };
  const app = express();

  // Logging, automatically log request info & expose `req.log` on requests
  app.use(
    pino({
      // Configure logger to redact where we send in auth tokens
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.cookies",
          'res.headers["set-cookie"]',
        ],
        censor: "***SENSITIVE***",
      },
    }),
  );

  // JSON Body Parser
  app.use(express.json());

  // URL Encoded Body Parser
  app.use(express.urlencoded({ extended: true }));

  // Cookie Parser
  // app.use(cookieParser());

  // Helmet security headers
  app.use(helmet(helmetConfig));

  // Attach healthcheck router
  app.use("/", getHealthcheckRouter("/healthcheck"));

  // Save options in app settings
  app.set(SettingKeys.Options, { ...defaultOptions, ...opts });

  // If JWT configs are present, create and save the JWT middleware in app settings.
  // const jwtMiddleware = jwtConfig ? jwt(jwtConfig, cookieName) : undefined;
  // app.set(SettingKeys.JWTMiddleware, jwtMiddleware);

  for (const handler of handlers) {
    // Create a fresh router for each handler
    const router: Router = express.Router();

    // Print to logs the routes as we process them
    console.log(
      `[${handler.method}] ${
        handler.requiresAuth ? "\tw/auth\t" : "\t\t"
      } ${apiPrefix}${handler.path} `,
    );

    // Bind the handler to the router
    // handler.bindToRouter(router, jwtMiddleware);
    handler.bindToRouter(router);

    // Bind the router to the app
    app.use(apiPrefix, router);
  }

  // This will take care of all `RespondableError`s raised by handler functions.
  // app.use(handleRespondableErrors);

  return app;
}

/**
 * Error handler for `RespondableError<T>`s. If `err` is not handled, `next`
 * will be called.
 * @param err Error
 * @param req Request
 * @param res Response
 * @param next Next Function
 * @returns void
 */
function getHealthcheckRouter(path: string) {
  const router = express.Router();

  // Healthcheck route
  router.get(path, (_, res) => res.status(200).send("OK"));
  
  return router;
}
