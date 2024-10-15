import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  EXPIRE_DAY_RREFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refresh_token';

  constructor(private jwt: JwtService, private userService: UserService) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueToken(user._id.toString());
    return { userId: user._id, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.userService.create(dto);

    const tokens = this.issueToken(user._id.toString());

    return { userId: user._id, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(result.id);
    if (!user) throw new UnauthorizedException('User not found');

    const tokens = this.issueToken(user._id.toString());

    return { user, ...tokens };
  }

  private issueToken(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, { expiresIn: '1h' });

    const refreshToken = this.jwt.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_RREFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      sameSite: 'none',
    });
  }
}
