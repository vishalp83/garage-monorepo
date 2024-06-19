import {
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router,
  } from "express";
  import { ValidationChain, matchedData } from "express-validator";
  import { RespondableError, UnexpectedError, ValidationError } from "./errors";
  import { validationResult } from "express-validator";
  
  export type HttpVerb = "get" | "post" | "put" | "delete";
  
  /**
   * Base class for API handlers, includes `express-validator` middlewares in the
   * `validations` field, and defines the handler function that needs to be
   * implemented. A `method`, `path`, and `handler` are required to use this
   * class, but further modifications can be performed by overriding `createModel`
   * and/or `middleware` methods.
   *
   * Type params `InputModel` and `OutputModel` control the typing of the
   * handler function. The method `middleware` calls `handler` with an input
   * model it creates in `createModel`. By default, `createModel` just returns
   * the results of the validation as `InputModel`, but you can override the
   * method for more fine grained control. The output of `handler` is then
   * returned as a json payload (also defined in `middleware`).
   *
   * To attach an instance of Handler to a router, use the `bindToRouter`
   * function, which accepts a Router.
   *
   * example: `handler.bindToRouter(router)`
   */
  export abstract class Handler<InputModel, OutputModel, AuthModel> {
    /* eslint-disable @typescript-eslint/no-unused-vars */
  
    /**
     * Which HTTP Verb applies to this handler
     */
    abstract method: HttpVerb;
  
    /**
     * Which path to mount.
     */
    abstract path: string;
  
    /**
     * Array of `express-validator` validation chains to apply to the request.
     * If any generate an error, the `validate` middleware will return a `400`
     * with the error message, and `handler` will *not* be called.
     */
    abstract validations: Array<ValidationChain>;
  
    /**
     * Does this handler require JWT authorization? Defaults to `true`
     */
    public requiresAuth = true;
  
    /**
     * Returns the auth token if present on the request. Frees the token from
     * the req object so it can be used throughout the handler object.
     */
    protected async auth(req: Request): Promise<AuthModel> {
      return (req as Request & { auth: AuthModel }).auth;
    }
  
    /**
     * Maps an instance of InputModel. The first arg is the data
     * `express-validator` extracted from the request. This happens via
     * `express-validator` rules, so make sure the rules line up with the model
     * you are returning.
     *
     * The default implementation just passes back the sanitized data from the
     * validations.
     *
     * Override this method for more precise control over how the model is
     * created, or to effect changes based on auth/req.
     */
    protected async createModel(
      data: InputModel,
      auth: AuthModel,
      req: Request,
    ): Promise<InputModel> {
      return data;
    }
  
    /**
     * Sends the output of the handler to the client as json with a 200 status.
     * Override to change or add to the response, such as sending other status
     * codes (i.e.: 201 if you need it), add headers, or change the output format
     * @param model
     * @param res
     */
    protected async sendModel(model: OutputModel, res: Response): Promise<void> {
      res.json(model);
    }
  
    /**
     * Handler function that gets run if no validation errors are present. If any
     * are found, this function will not be run. Instead a 400 and the validation
     * error messages will be returned.
     * @param req Express Request
     * @param res Express Response
     */
    abstract handler(
      /**
       * Data mapped from the validations as an `InputModel`
       */
      input: InputModel,
  
      /**
       * Auth token payload
       */
      auth: AuthModel,
    ): Promise<OutputModel>;
  
    /**
     * The middleware that is exposed to Express. Handles calling the following
     * in order:
     * * `createModel`, which makes the input for `handler`.
     * * `handler`, which returns the response body
     * * `res.json`, to send a 200 (if your handler didn't set a different one),
     *    with the response body
     */
    protected async middleware(req: Request, res: Response, next: NextFunction) {
      try {
        // Resolve auth if it exists
        const auth = await this.auth(req);
        // Get data from validation rules
        const data = matchedData(req) as InputModel;
        // Pass data, auth, and the req to resolve into a `InputModel`
        const inputModel = await this.createModel(data, auth, req);
        // Resolve `InputModel` into `OutputModel`
        const outputModel: OutputModel = await this.handler(inputModel, auth);
        // Send json response
        await this.sendModel(outputModel, res);
      } catch (e) {
        // Check for `RespondableError`, our base class for API errors, and
        // forward the error to the error handler via next(error)
        if (e instanceof RespondableError) {
          req.log.info({ error: e, req, res }, "Caught respondable error.");
  
          return next(e);
        }
  
        // logs with level=error, includes all data available, redactions still apply
        req.log.error(
          { error: (e as Error)?.message, req, res },
          "Caught unexpected error.",
        );
  
        // Never include context in `UnexpectedError`, otherwise might leak logs
        return next(new UnexpectedError());
      }
    }
  
    /**
     * How to apply validation to this request. By default collects errors via
     * `express-validator`'s `validationResult` function over the request,
     * returning a `400` status with the errors as a JSON body.
     *
     * Override to customize validation for non-standard requests.
     */
    protected validate(req: Request, res: Response, next: NextFunction): void {
      const result = validationResult(req).array();
      if (result.length > 0) {
        return next(new ValidationError(result));
      }
  
      next();
    }
  
    /**
     * Binds this handler to the router at `path`.
     * @param router Router instance
     */
    bindToRouter(router: Router, jwtMiddleware?: RequestHandler) {
      if (!jwtMiddleware && this.requiresAuth) {
        throw new Error(
          "Misconfiguration detected: A route requires auth, but no JWT middleware is registered.",
        );
      }
      router[this.method](
        this.path,
        ...(jwtMiddleware && this.requiresAuth ? [jwtMiddleware] : []),
        ...this.validations,
        this.validate.bind(this),
        this.middleware.bind(this),
      );
    }
  }
  