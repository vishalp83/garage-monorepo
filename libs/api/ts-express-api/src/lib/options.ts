import { Params } from "express-jwt";
import { HelmetOptions } from "helmet";
import { Handler } from "./handler";

/**
 * Options for configuring the Express App and associated middleware.
 *
 * Include an `jwtConfig` to configure a JWT Middleware function. This function
 * can be found at `app.get(SettingKeys.JWTMiddleware)`.
 *
 * Include `cookieName` to enable pulling auth tokens from that cookie in the
 * default `tokenGetter` function. (If you include your own `tokenGetter`
 * function in `jwtConfig` you will have to handle cookie searching yourself
 * there)
 *
 * Include `helmetConfig` to override helmet defaults.
 */
export interface Options {
  /**
   * Root of the API path. Can be multiple segments. Should not end in a slash.
   */
  apiPrefix: string;

  /**
   * Cookie to inspect for a JWT. Optional, if left undefined JWT middleware
   * will only consider Auth header.
   */
  cookieName?: string;

  /**
   * Handlers to attach to the API
   */
  handlers: Array<Handler<unknown, unknown, unknown>>;

  /**
   * Configuration for helmet
   */
  helmetConfig?: HelmetOptions;

  /**
   * Configuration for JWT auth. Configures app.jwtMiddleware
   */
  jwtConfig?: Params;
}

export const defaultOptions: Options = {
  apiPrefix: "/api",
  handlers: [],
};

/**
 * Values in the settings collection of an express instance
 */
export enum SettingKeys {
  /**
   * Fetches the JWT middleware function configured for your app instance
   */
  JWTMiddleware = "JWTMiddleware",

  /**
   * The original options object passed into `appFactory(opts)`
   */
  Options = "Options",
}
