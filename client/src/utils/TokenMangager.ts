

interface ITokenManger {
    getAccessToken(): string | null;
    setToken(accessToken: string): void;
    clearToken(): void
}


class TokenManager implements ITokenManger {
    getAccessToken(): string | null {
        return localStorage.getItem('token')
    }

    setToken(accessToken: string): void {
        localStorage.setItem('token', accessToken);
    }

    clearToken(): void {
        localStorage.removeItem('token')
    }
}

export default TokenManager;