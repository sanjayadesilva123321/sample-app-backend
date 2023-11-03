import {USER_ROLE_REPOSITORY} from "../../constant/index";
import {UserRole} from "../../models/user-role";

export const UserRoleProvider = [
    {
        provide: USER_ROLE_REPOSITORY,
        useValue: UserRole,
    },
];