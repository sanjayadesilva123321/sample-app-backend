export type userSignupResponse = {
    user: {
        id: number,
        email: string,
    }
}

export type userLoginResponse = {
    user: {
        id: number,
        email: string,
    },
    token: string,
    roleToken: string
}