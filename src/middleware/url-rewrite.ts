import { NextFunction, Request, Response } from 'express';

export const urlRewrite = async (req: Request, _: Response, next: NextFunction) => {
  if (req.url.startsWith('/users') && !req.url.startsWith('/users/v1')) {
    req.url = req.url.replace('/users', '');
  }
  next();
};
