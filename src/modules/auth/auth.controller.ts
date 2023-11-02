import { Controller, Post, UseGuards, Request  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('protected-route')
  @UseGuards(AuthGuard('jwt'))
  async protectedRoute() {
    // Your protected route logic
  }
}
