import {Injectable, Output, EventEmitter, NgZone} from '@angular/core';
import {Observable, AsyncSubject, Subject, BehaviorSubject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ApexService {
  private _loaderSubject: Subject<Boolean> = new BehaviorSubject(false);
  private _sessionUserSubject: Subject<Object> = new BehaviorSubject(null);
  private _menuSubject: Subject<Object[]> = new BehaviorSubject(null);
  private _dataSubject: Subject<any> = new BehaviorSubject(null);
  private _activeURLSubject: Subject<string> = new BehaviorSubject(null);

  constructor(private _domSanitizer: DomSanitizer, private zone: NgZone) {
  }

  getActiveURL(): Observable<any> {
    return this._activeURLSubject.asObservable();
  }

  setActiveURL(activeURL: any): any {
    this._activeURLSubject.next(activeURL);
  }

  showLoader(show: Boolean) {
    this.zone.run(() => {
      this._loaderSubject.next(show);
    });
  }

  loaderEvent(): Observable<Boolean> {
    return this._loaderSubject.asObservable();
  }

  sessionUserEvent(): Observable<Object> {
    return this._sessionUserSubject.asObservable();
  }

  menuEvent(): Observable<Object[]> {
    return this._menuSubject.asObservable();
  }

  dataEvent(): Observable<any> {
    return this._dataSubject.asObservable();
  }

  dataEmit(data: any): any {
    this._dataSubject.next(data);
  }

  menuEmit(menu: any) {
    this.zone.run(() => {
      this._menuSubject.next(menu);
    });
  }

  sessionUserEmit(sessionUser: any) {
    this._sessionUserSubject.next(sessionUser);
  }

  bypassURL(url: string) {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
