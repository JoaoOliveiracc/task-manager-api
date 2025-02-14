import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from './user/user.service';
import { User } from "./entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: any): Promise<User> {
    return this.userService.findOneById(payload.sub);
  }
}