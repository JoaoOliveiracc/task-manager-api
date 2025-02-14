import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { UserService } from "../user/user.service";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword
    });
    return this.login(newUser);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}