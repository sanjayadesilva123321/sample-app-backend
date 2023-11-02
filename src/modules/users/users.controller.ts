import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/models/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('signup')
  async signUp(@Body() body: { email: string, password: string }): Promise<any> {
    const { email, password } = body;
    const existingUser = await this.usersService.getUserDetailsByEmail(email);

    if (existingUser) {
      return { message: 'Username already exists' };
    }
    const user = await this.usersService.create(email, password);
    const token = this.generateToken(user);
    const roleToken = this.generateUserRoleToken(user);

    return { user, token, roleToken };
  }

  private generateToken(user: User): String {
    const token = jwt.sign({ id: user.id, username: user.email }, 'your_secret_key', { expiresIn: '1h' });
    return token;
  }

  private generateUserRoleToken(user: User): String {
    const token = jwt.sign({ id: user.id, username: user.email }, 'your_secret_key', { expiresIn: '1h' });
    return token;
  }
}
