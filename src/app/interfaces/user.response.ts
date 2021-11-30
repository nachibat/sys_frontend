export interface LoginResponse {
    ok: boolean;
    token: string;
}

export interface UserResponse {
    ok: boolean;
    user: User;
}

export interface UserModifyResponse {
    ok: boolean;
    userModified: User;
}

export interface User {
    _id: string;
    username: string;
    role: string;
    state: boolean;
    name:string,
    lastname:string,
    email:string,
    createdAt: Date;
    updatedAt: Date;
}