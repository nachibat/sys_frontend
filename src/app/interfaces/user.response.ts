export interface LoginResponse {
    ok:    boolean;
    token: string;
}

export interface UserResponse {
    ok:   boolean;
    user: User;
}

export interface User {
    _id:       string;
    username:  string;
    role:      string;
    state:     boolean;
    createdAt: Date;
    updatedAt: Date;
}