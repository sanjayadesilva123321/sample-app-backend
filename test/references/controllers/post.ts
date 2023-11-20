export const getPostsMockResponse = [
    {
        "id": 1002,
        "title": "Post004",
        "content": "sample post 4"
    }
]

export const getPostUpdateMockResponse={
        "id": 1002,
        "title": "updated title3",
        "content": "test post content",
        "created_by": 20003,
        "updated_by": null
}

export const deletePostMockResponse={
    "code": 200,
    "data": {},
    "message": "Deleted successfully",
    "success": true
}
export const getPostsMockRequestParams = {"roleId":1};