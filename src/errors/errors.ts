/* eslint-disable max-classes-per-file */
import { Response } from "express";
import ERR from "../commons/errorResponse";
import { ValidationError } from "joi";
import { removeRegEx } from "../utils/strings.utils";

import { AxiosError } from "axios";

export interface ErrorWithHttpCode {
  message: string;
  code: number;
}

export class UserError extends Error implements ErrorWithHttpCode {
  message: string;

  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

export class SystemError extends Error {
  code: number;

  constructor(error?: string) {
    super(error || "unable to process request at this time");
    this.code = 500;
  }
}

export class NotFoundError extends UserError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class FoundError extends UserError {
  constructor(resource: string) {
    super(`${resource} already exists`, 400);
  }
}

export class UserNotAuthorized extends UserError {
  constructor() {
    super(`user not authorized`, 403);
  }
}

export class InvalidCredentials extends UserError {
  constructor() {
    super(`Invalid Credentials`, 401);
  }
}

export class UserAlreadyExists extends UserError {
  constructor() {
    super(`user already exists`, 400);
  }
}

export class UserRoleNotMatched extends UserError {
  constructor() {
    super(`user not authorized to access this application`, 403);
  }
}

export class ActionNotAllow extends UserError {
  constructor() {
    super(
      `you are not allowed to perform this action. Please ensure you have the correct rights`,
      403
    );
  }
}

export class ResourceRequired extends UserError {
  constructor(resource: string) {
    super(`${resource} is required`, 400);
  }
}

export class AxiosErr extends UserError {
  // eslint-disable-next-line no-useless-constructor
  constructor(message: string, code: number) {
    super(message, code);
  }
}

export function handleError(error: unknown): UserError | AxiosErr | SystemError {
  console.log(error);
  //@ts-ignore
  if (error?.code === 11000) {
    return new UserAlreadyExists();
  }

  if (error instanceof UserError) {
    return error;
  }

  if (error instanceof ValidationError) {

    const { details } = error;

    const code = 422;
    const errMsg = removeRegEx(/"/g, details[0].message);

    return new UserError(errMsg, code);
  }

  if (error instanceof AxiosError) {
    const code = error.response?.status || 400;
    const errMsg =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Bad request";

    return new AxiosErr(errMsg, code);
  }

  return new SystemError(error as string);
}

export function sendErrorResponse(res: Response, error: UserError): void {
  // console.error(error);
  res.status(error.code || 500).json(ERR(error.message));
}
