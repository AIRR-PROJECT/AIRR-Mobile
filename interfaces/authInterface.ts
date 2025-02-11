export interface LoginCredentials {
    username: string;
    password: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: any;
}