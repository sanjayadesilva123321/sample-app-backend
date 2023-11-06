import { Inject, Injectable } from '@nestjs/common';
import { USER_ROLE_REPOSITORY } from "../../constant/index";
import { UserRole } from "../../models/user-role";
import { UserRoleDal } from "../user-role/user-role.dal";

@Injectable()
export class UserRoleService {

  constructor(
    @Inject(USER_ROLE_REPOSITORY) private userRoleRepository: typeof UserRole,
    private userRoleDal: UserRoleDal
) {}

async create(user_id: number, role_id: number): Promise<UserRole> {
    return await this.userRoleDal.createUserRole({
        user_id: user_id,
        role_id: role_id
    });
}

async getUserRoles(user_id: number): Promise<UserRole[]> {
  return await this.userRoleDal.findAllByPayload({
      where: {
          user_id: user_id,
      }
      ,
      attributes: ["id","user_id","role_id","permission_id"],
  });
}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
