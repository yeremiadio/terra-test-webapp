//Please give prefix I for Interface, the T for Type
import { IUserCredentialData } from "@/types/api/user";

export type TStoredCookieValue = {
  id: number;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  token: string;
  reset_pass: boolean;
};

export type TStoredCookieName =
  keyof Pick<IUserCredentialData, 'id' | 'username' | 'email' | "iat" | 'exp'> | "role"
  | "token"
  | "reset_pass"
  | "unit_name";
