import { jwtDecode } from "jwt-decode"

interface UserTokenPayload {
  id: string;
  role: 'USER' | 'ADMIN' | 'CUSTOMER' | 'SELLER';
  email: string;
  [key: string]: any;
}

export const verifyToken = (token: string): UserTokenPayload => {
    return jwtDecode(token) as UserTokenPayload;
}