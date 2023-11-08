import {USER_REPOSITORY} from "../../constant/index";
import {USER_ROLE_REPOSITORY} from "../../constant/index";
import {User} from "../../models/user";
import {UserRole} from "../../models/user-role";

export const UserProvider = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
    {
        provide: USER_ROLE_REPOSITORY,
        useValue: UserRole,
    },
];
