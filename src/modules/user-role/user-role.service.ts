import { Inject, Injectable } from '@nestjs/common';
import { USER_ROLE_REPOSITORY } from "../../constant/index";
import { UserRole } from "../../models/user-role";
import { UserRoleDal } from "../user-role/user-role.dal";
import { Role } from "../../models/role";

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

async getUserRoles(user_id: number) : Promise<String[]> {

  const userRoles = await UserRole.findAll({
    where: { user_id  }
  ,
  include: [{ model: Role }]
  });
  return userRoles.map((userRole) => userRole.role.role);
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
