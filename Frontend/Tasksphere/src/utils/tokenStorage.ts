import { jwtDecode } from "jwt-decode"

const TOKEN_KEY = "auth_token"

interface JwtPayload {
  sub: string
  role: string
  exp: number
}

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getUserRole = (): string | null => {
  const token = getToken()

  if (!token) return null

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.role
  } catch {
    return null
  }
}


export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};