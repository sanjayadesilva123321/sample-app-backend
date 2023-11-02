import {USER_REPOSITORY} from "../../constant/index";
import {User} from "../../models/user";

export const UserProvider = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];