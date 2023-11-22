import {USER_REPOSITORY, USER_ROLE_REPOSITORY} from "../../constant";
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
