
export const TOKEN_KEYS = {
    user: {
        access: 'user_access_token',
        refresh: 'user_refresh_token'
    },
    doctor: {
        access: 'doctor_access_token',
        refresh: 'doctor_refresh_token'
    },
    admin: {
        access: 'admin_access_token',
        refresh: 'admin_refresh_token'
    }
} as const


interface ITokenManger {
    getAccessToken(role: keyof typeof TOKEN_KEYS): string | null;
    getRefreshToken(role: keyof typeof TOKEN_KEYS): string | null;
    setTokens(role: keyof typeof TOKEN_KEYS, accessToken: string, refreshToken: string): void;
    clearTokens(role: keyof typeof TOKEN_KEYS): void
}


class TokenManager implements ITokenManger {
    getAccessToken(role: keyof typeof TOKEN_KEYS): string | null {
        return localStorage.getItem(TOKEN_KEYS[role].access)
    }

    getRefreshToken(role: keyof typeof TOKEN_KEYS): string | null {
        return localStorage.getItem(TOKEN_KEYS[role].refresh)
    }

    setTokens(role: keyof typeof TOKEN_KEYS, accessToken: string, refreshToken: string): void {
        localStorage.setItem(TOKEN_KEYS[role].access, accessToken);
        localStorage.setItem(TOKEN_KEYS[role].refresh, refreshToken)
    }

    clearTokens(role: keyof typeof TOKEN_KEYS): void {
        localStorage.removeItem(TOKEN_KEYS[role].access)
    }
}

export default TokenManager;