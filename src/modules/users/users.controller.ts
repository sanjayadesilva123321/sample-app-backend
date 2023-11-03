import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Logger} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {Request, Response} from "express";
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import { UsersService } from './users.service';
import { UserRoleService } from '../user-role/user-role.service';
import { MainService} from "../../utils/main/main.service";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/models/user';
import { ROLES } from "../../constant/index";
import { createUserRequestBodyDTO } from "../../dto/user";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly userRoleService: UserRoleService,
    private mainsService: MainService,
    private readonly logger: Logger
) {}

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
  async signUp(
      @Req() request: Request,
      @Body() requestBody: createUserRequestBodyDTO,
      @Res() response: Response
  ){
    try {
      const { email, password } = requestBody;
      const existingUser = await this.usersService.getUserDetailsByEmail(email);
  
      if (existingUser) {
        return this.mainsService.sendResponse(
          response,
          ResponseMessages.USER_ALREADY_EXISTS,
          null,
          false,
          ResponseCode.UNPROCESSABLE_CONTENT,
          ResponseCode.DUPLICATE_USER
      );
      }
      const hashedPassword = await this.usersService.hashPassword(password);
      const user = await this.usersService.create(email, hashedPassword);
      const userRole = await this.userRoleService.create(user.id, ROLES.USER);
      const token = this.generateToken(user);
  
      return this.mainsService.sendResponse(
        response,
        ResponseMessages.CREATED,
        {user,
        ...{
            token
        }},
        true,
        ResponseCode.CREATED
    );
    } catch (error: any) {
      //this.loggerService.logger(LOG_LEVELS.ERROR, "Error in activity log controller: " + error);
      this.logger.log("Error in creating user in user controller");
      this.logger.error("Error in user controller: "+ error)
      this.mainsService.sendResponse(
          response,
          ResponseMessages.INTERNAL_SERVER_ERROR,
          error,
          false,
          ResponseCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  private generateToken(user: User): String {
    const token = jwt.sign({ id: user.id, username: user.email }, 'sample_app_key', { expiresIn: '1h' });
    return token;
  }
}
