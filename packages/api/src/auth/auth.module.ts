import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { auth } from './auth.js';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.url.startsWith('/api/auth')) {
    return toNodeHandler(auth)(req, res);
  }
  next();
}

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes('*');
  }
}
