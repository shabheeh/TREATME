
export const TOKEN_KEYS = {
    user: {
        access: 'user_access_token',
    },
    doctor: {
        access: 'doctor_access_token',
    },
    admin: {
        access: 'admin_access_token',
    }
} as const


interface ITokenManger {
    getAccessToken(role: keyof typeof TOKEN_KEYS): string | null;
    setToken(role: keyof typeof TOKEN_KEYS, accessToken: string): void;
    clearToken(role: keyof typeof TOKEN_KEYS): void
}


class TokenManager implements ITokenManger {
    getAccessToken(role: keyof typeof TOKEN_KEYS): string | null {
        return localStorage.getItem(TOKEN_KEYS[role].access)
    }

    setToken(role: keyof typeof TOKEN_KEYS, accessToken: string): void {
        localStorage.setItem(TOKEN_KEYS[role].access, accessToken);
    }

    clearToken(role: keyof typeof TOKEN_KEYS): void {
        localStorage.removeItem(TOKEN_KEYS[role].access)
    }
}

export default TokenManager;