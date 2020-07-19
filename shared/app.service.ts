import {Injectable} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ApexService} from './apex.service';
import {Storage} from './utils/storage';

@Injectable()
export class AppService {
  constructor(private router: Router, private route: ActivatedRoute, private apexService: ApexService) {
  }

  navigate(url: String, params: any[]) {
    this.apexService.setActiveURL(url);
    if (params) {
      let param: any = {};
      if (params instanceof Array) {
        for (let i = 0; i < params.length; i++) {
          for (let key in params[i]) {
            param[key] = params[i][key];
          }
        }
      } else {
        param = params;
      }

      const navigationExtras: NavigationExtras = {
        queryParams: param,
      };
      this.router.navigate([url], navigationExtras);
    } else {
      this.router.navigate([url]);
    }
  }

  getParam(key: string): string {
    // console.log(this.route.snapshot);
    //  this.route.params.subscribe(params => {console.log( parseInt(params['id'], 10) )});
    return this.route.snapshot.queryParams[key];
  }

  isAccess(path: String) {
    return true;
  }

  //isAccess(path: String){
  //    let returnValue = false;
  //    for(let menu of Util.RoleMenu()){
  //        if(menu.link.toLowerCase() == path.toLowerCase()) {
  //            returnValue =  true;
  //            break;
  //        }
  //    }
  //    return returnValue;
  //}
  getLocalItem(key: string) {
    return Storage.getLocalItem(key);
  }

  setLocalItem(key: string, value: any) {
    return Storage.setLocalItem(key, value);
  }

  getSessionItem(key: string) {
    return Storage.getSessionItem(key);
  }

  setSessionItem(key: string, value: any) {
    return Storage.setSessionItem(key, value);
  }

  // showLoader(show: boolean) {
  //   this.apexService.showLoader(show);
  // }

  // showMessage(message: string) {
  //   this.apexService.showMessage(message);
  // }

  // sessionUserEmit(data: any) {
  //   this.apexService.sessionUserEmit(data);
  // }

  // dataEmit(data: any) {
  //   this.apexService.dataEmit(data);
  // }

  // menuEmit(data: any) {
  //   this.apexService.menuEmit(data);
  // }

  getBranch(): any {
    return Storage.getBranch();
  }

  getSessionUser() {
    return Storage.getSessionUser();
  }

  // sessionClear() {
  //   Storage.clearSession();
  //   this.sessionUserEmit(null);
  // }
}
