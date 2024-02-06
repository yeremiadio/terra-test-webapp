export type Nullable<D> = D | null | undefined;

export type TKnownRoleUserEnum = string;

export type TResetPasswordResponse = {
  temp_password: string;
};

export type TResetPasswordRequest = {
  usernameoremail: string;
  oldpassword: string;
  newpassword: string;
};

/**
 *   "" means no usertype
 * ```bash
 *   "systemadmin"   : datacakra's admin
 *   "superadmin"    : superadmin for a company
 *   "admin"         : admin of a company
 *   "officer"       : officer of a company
 *   "operator"      : operator of a company
 * ```
 */
export type TKnownUsertype =
  | "systemadmin"
  | "superadmin"
  | "admin"
  | "officer"
  | "operator";

export interface IUserCredentialData {
  id: number;
  username: Nullable<string>;
  email: Nullable<string>;
  usertypeId: Nullable<number>;
  usertypeName: Nullable<TKnownUsertype>;
  companyId: Nullable<number>;
  companyName: Nullable<string>;
  iat: number;
  exp: number;
  jwt: string;
}
