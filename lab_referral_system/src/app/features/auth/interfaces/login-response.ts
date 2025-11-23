export interface LoginResponse {
    accessToken: string;
    userId: string;
    email: string;
    roles: string[];
}