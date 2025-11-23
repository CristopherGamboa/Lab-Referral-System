export interface JwtPayload {
    roles: string,
    userId: string,
    labId: string,
    subject: string,
    exp: number
}
