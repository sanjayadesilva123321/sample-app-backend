import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProvider } from "./users.provider";
import { UserDal } from "./users.dal";

@Module({
  controllers: [UsersController],
  providers: [...UserProvider, UsersService, UserDal],
})
export class UsersModule {}
