import Cookies from "js-cookie";

import { TStoredCookieName } from "@/types/cookie";

interface CookieObject {
  [key: string]: string;
}

const saveCookie = (
  key: TStoredCookieName,
  value: string | number,
  options?: Cookies.CookieAttributes
) => {
  const stringValue = value.toString();
  Cookies.set(key, stringValue, options ?? { sameSite: "strict" });
};

const saveTheseCookies = (cookieObject: CookieObject, options?: Cookies.CookieAttributes): void => {
  for (const key in cookieObject) {
    if (Object.hasOwnProperty.call(cookieObject, key)) {
      const value = cookieObject[key];
      Cookies.set(key, value, options ?? { sameSite: "strict" });
    }
  }
}

const loadCookie = (key: TStoredCookieName) => {
  const value = Cookies.get(key);
  if (!value) return null;
  return value;
};

const deleteCookie = (key: TStoredCookieName) => {
  Cookies.remove(key);
};

/**
 * 
 * @todo refactor soon
 * @param keys 
 * @returns 
 */
const loadCookiesOfKeys = <T>(keys: Array<keyof T>): T => {
  const allCookies = Cookies.get();
  const filteredCookies: T = {} as T;

  Object.entries(allCookies).filter(([key]) => keys.includes(key as keyof T)).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    filteredCookies[key] = value;
  })
  return filteredCookies;

}

const deleteAllCookies = () => {
  const allCookies = Cookies.get();
  for (const key in allCookies) {
    Cookies.remove(key);
  }
};

export {
  saveCookie,
  saveTheseCookies,
  loadCookie,
  deleteCookie,
  deleteAllCookies,
  loadCookiesOfKeys,
};
