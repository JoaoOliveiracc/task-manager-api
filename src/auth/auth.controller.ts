import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //  Login route
  @Post('login')
  async login(@Body() user: User) {
    return this.authService.login(user);
  }

  // Register Route
  @Post('register')
  async register(@Body() body: { name: string, email: string, password: string }) {
    console.log(body);
    return this.authService.register(body.name, body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Body() user: User) {
    return user;
  }
}