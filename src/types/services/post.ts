export type UserSignupResponse = {
    user: {
        id: number,
        email: string,
    }
}

export type UserLoginResponse = {
    user: {
        id: number,
        email: string,
    },
    token: string,
    roleToken: string
}