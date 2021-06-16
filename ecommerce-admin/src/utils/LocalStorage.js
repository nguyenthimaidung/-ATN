export const LocalKeys = {
  ACCESS_TOKEN: 'access_token',
};

export class LocalStorage {
  static get(key) {
    return window.localStorage ? window.localStorage.getItem(key) : undefined;
  }

  static set(key, val) {
    return window.localStorage ? window.localStorage.setItem(key, val) : 0;
  }

  static clear() {
    return window.localStorage ? window.localStorage.clear() : 0;
  }

  static remove(key) {
    return window.localStorage ? window.localStorage.removeItem(key) : 0;
  }
}
