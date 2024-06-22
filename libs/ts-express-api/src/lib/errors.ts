import { NextFunction, Request, Response } from "express";
import { ValidationError as ExpressValidationError } from "express-validator";
import { v4 } from "uuid";

export enum ErrorCode {
  UnexpectedError = "UNX",
  ValidationError = "VAL",
}

type SpreadableObject = {
  [prop: string]: unknown;
};

/**
 * Represents an error that can be mapped to a HTTP response. Extends `Error`
 * to add a status code and a method to send the error.
 */
export abstract class RespondableError<
  T extends SpreadableObject
> extends Error {
  /**
   * Error ID uniquely identifying this instance of error. Use for log searches.
   */
  readonly errorId: string = v4();

  /**
   * Code that maps to the error. Each subclass should be assigned a constant,
   * unique error code. i.e. `E100` or `I999` etc.
   */
  abstract errorCode: string;

  /**
   * Status code to return.
   */
  abstract status: number;

  /**
   * Extra contextual info that can help debugging. (`invoiceId`, `userId`, etc.)
   */
  abstract context: T;

  /**
   * Allow some of the context to be returned to the client. Use case: returning
   * validation messages.
   * @returns Part of the context. Default is to return an empty object (`{}`).
   */
  protected publicContext(): Partial<T> {
    return {};
  }

  /**
   * Send response to client with this error's status code & message.
   * @param res Express Response Object
   */
  respond(res: Response) {
    res.status(this.status).json({
      message: this.message,
      ...this.publicContext(),
      errorCode: this.errorCode,
    });
  }
}

/**
 * Represents an unclassified error occurring during a request.
 *
 * Status: `500`
 */
export class UnexpectedError<
  T extends SpreadableObject
> extends RespondableError<T> {
  readonly errorCode: ErrorCode = ErrorCode.UnexpectedError;
  readonly status: number = 500;
  constructor(public context: T = {} as T) {
    super("The system encountered an unexpected error.");
  }
}

export type ValidationErrorContext = {
  validationErrors: Array<ExpressValidationError>;
};

/**
 * Represents validations errors returned to the client. These come from
 * `express-validator`'s validation extractors, and are raised from
 * `Handler.validate()`.
 *
 * Status `400`
 */
export class ValidationError extends RespondableError<ValidationErrorContext> {
  readonly errorCode: ErrorCode = ErrorCode.ValidationError;
  readonly status: number = 400;
  readonly context: ValidationErrorContext;

  /**
   * Opt-in inclusion of validation errors.
   * @returns Validation errors intended for the client.
   */
  protected override publicContext(): Partial<ValidationErrorContext> {
    return { validationErrors: this.context.validationErrors };
  }

  constructor(validationErrors: Array<ExpressValidationError>) {
    super("The system encountered the following validation issues.");
    this.context = { validationErrors };
  }
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
export function handleRespondableErrors<T extends SpreadableObject>(
  err: Error | RespondableError<T>,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof RespondableError) {
    err.respond(res);
    return;
  }

  next(err);
}
