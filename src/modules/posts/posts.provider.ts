import {POST_REPOSITORY} from "../../constant/index";
import {Post} from "../../models/post";

export const PostProvider = [
    {
        provide: POST_REPOSITORY,
        useValue: Post,
    }
];