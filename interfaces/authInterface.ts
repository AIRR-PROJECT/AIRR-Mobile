export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}

export interface VerifyAccountCredentials {
    email: string;
    otp: string
}

export interface VerifyPasswordCredentials {
    email: string;
    otp: string
}

export interface SetPasswordCredentials {
    email: string;
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