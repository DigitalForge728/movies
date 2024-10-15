import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { parse } from 'cookie';

const extractJwtFromHeaderCookie = (req: Request): string | null => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parse(cookieHeader);
    return cookies['auth_token'];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: extractJwtFromHeaderCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id }: { id: string }) {
    return this.userService.getById(id);
  }
}
