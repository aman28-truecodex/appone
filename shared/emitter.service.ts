import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EmitterService {

  private loginCompleteSource = new Subject<string>();
  loginComplete$ = this.loginCompleteSource.asObservable();

  private productGroupSource = new Subject<any>();
  productGroup$ = this.productGroupSource.asObservable();

  private parentOrgCodeSource = new Subject<any>();
  parentOrgCodeSource$ = this.parentOrgCodeSource.asObservable();

  private orgUnitCodeSource = new BehaviorSubject<string[]>([]);
  orgCodeSource$ = this.orgUnitCodeSource.asObservable();

  private scCodeSource = new BehaviorSubject<string[]>([]);
  scCodeSource$ = this.scCodeSource.asObservable();

  private emptyProjSource = new Subject<any>();
  emptyProjSource$ = this.emptyProjSource.asObservable();

  broadcastloginComplete(loginStatus: string) {
    this.loginCompleteSource.next(loginStatus);
  }

  broadcastProductGroup(productGrp: any) {
    this.productGroupSource.next(productGrp);
  }

  broadcastParentOrgUnitCode(ParentOrgCodes: any) {
    this.parentOrgCodeSource.next(ParentOrgCodes);
  }

  broadcastOrgUnitCode(OrgUnitCodes: any) {
    this.orgUnitCodeSource.next(OrgUnitCodes);
  }

  broadcastScCode(scCodes: any) {
    this.scCodeSource.next(scCodes);
  }

  broadcastemptyProj(show: any) {
    this.emptyProjSource.next(show);
  }

}
