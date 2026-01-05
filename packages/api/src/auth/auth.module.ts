import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      // Fix for Express 5: The /*path pattern sets req.url=/ and
      // req.baseUrl=full_path. better-call concatenates baseUrl+url creating
      // a trailing slash that causes 404. This middleware restores req.url
      // to the full path before the handler runs.
      middleware: (req, _res, next) => {
        req.url = req.originalUrl;
        req.baseUrl = '';
        next();
      },
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
