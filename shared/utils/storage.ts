/** Storage  */
export class Storage {
  static pid: string = 'dff';

  static setLocalItem(key: string, val: any) {
    key = this.pid + '-' + key;
    if (val) {
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      localStorage.setItem(key, val);
    }
  }

  static getLocalItem(key: string) {
    key = this.pid + '-' + key;
    let val: string = localStorage.getItem(key);
    if (val) {
      if (val.indexOf('{') > -1) {
        val = JSON.parse(val);
      } else if (val.indexOf('[') > -1) {
        val = JSON.parse(val);
      }
      return val;
    } else {
      return null;
    }
  }

  static removeLocalItem(key: string) {
    key = this.pid + '-' + key;
    localStorage.removeItem(key);
  }

  static setSessionItem(key: string, val: any) {
    key = this.pid + '-' + key;

    if (val) {
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      } else if (Array.isArray(val)) {
        val = JSON.stringify(val);
      }

      sessionStorage.setItem(key, val);
    }
  }

  static getSessionItem(key: string): any {
    key = this.pid + '-' + key;
    let val: string = window.sessionStorage.getItem(key);
    if (val) {
      if (val.indexOf('{') > -1) {
        val = JSON.parse(val);
      } else if (val.indexOf('[') > -1) {
        val = JSON.parse(val);
      }
      return val;
    } else {
      return null;
    }
  }

  static removeSessionItem(key: string) {
    key = this.pid + '-' + key;
    sessionStorage.removeItem(key);
  }

  static sessionClear() {
    sessionStorage.clear();
  }

  static setJWT(val: string) {
    if (val) {
      sessionStorage.setItem(this.pid + '-jwt', val);
    }
  }

  static getJWT() {
    return sessionStorage.getItem(this.pid + '-jwt');
  }

  static setSessionUser(val: any) {
    if (val) {
      this.setSessionItem('user', val);
    }
  }

  static getSessionUser(): any {
    return this.getSessionItem('user');
  }

  static setMenuList(val: any) {
    if (val) {
      this.setSessionItem('menu', val);
    }
  }

  static getMenuList(): any {
    return this.getSessionItem('menu');
  }

  static getBranch(): string {
    return this.getSessionItem('branch');
  }

  static setBranch(val: any) {
    if (val) {
      this.setSessionItem('branch', val);
    }
  }

  static setActiveLink(val: any) {
    if (val) {
      this.setSessionItem('link', val);
    }
  }

  static getActiveLink(): string {
    return this.getSessionItem('link');
  }

  static clearSession(): void {
    this.sessionClear();
    this.removeSessionItem('jwt');
    this.removeSessionItem('user');
    this.removeSessionItem('menu');
    this.removeSessionItem('branch');
    this.removeSessionItem('link');
  }
}
