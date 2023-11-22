import {POST_REPOSITORY} from "../../constant";
import {Post} from "../../models/post";

export const PostProvider = [
    {
        provide: POST_REPOSITORY,
        useValue: Post,
    },
];
