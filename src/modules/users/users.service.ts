import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from "../../constant/index";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "../../models/user";
import { UserDal } from "./users.dal";

@Injectable()
export class UsersService {

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: typeof User,
    private userDal: UserDal
) {}

async create(email: string, password: string): Promise<User> {
  try {
    return await this.userDal.createUser({
        email: email,
        password: password
    });
} catch (error) {
    //this.loggerService.logger(LOG_LEVELS.ERROR, "Error in activity log service : " + error);
    throw error;
}
}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserDetailsByEmail(email: string): Promise<User> {
    try {
        return await this.userDal.findOne({
            where: {
                email: email,
            },
            attributes: ["id", "email"],
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
