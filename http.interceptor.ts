import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {LoaderService} from './shared/loader.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  cloneReq: any;

  constructor(public toasterService: ToastrService,
              public loaderService: LoaderService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    if (req.url.includes('?')) {
      this.cloneReq = !!sessionStorage.getItem('access_token') ? req.clone({url: req.url + `&access_token=${sessionStorage.getItem('access_token')}&tenantId=${sessionStorage.getItem('tenantId')}`}) : req.clone(req);
    } else {
      if (req.url.includes('defaultcreation')) {
        this.cloneReq = !!sessionStorage.getItem('access_token') ? req.clone({url: req.url + `?access_token=${sessionStorage.getItem('access_token')}`}) : req.clone(req);
      } else if (req.url.includes('user')) {
        if (!!sessionStorage.getItem('createUserClientId')) {
          this.cloneReq = !!sessionStorage.getItem('access_token') ? req.clone({url: req.url + `?access_token=${sessionStorage.getItem('access_token')}&tenantId=${sessionStorage.getItem('createUserClientId')}`}) : req.clone(req);
        } else {
          this.cloneReq = !!sessionStorage.getItem('access_token') ? req.clone({url: req.url + `?access_token=${sessionStorage.getItem('access_token')}&tenantId=${sessionStorage.getItem('tenantId')}`}) : req.clone(req);
        }
      } else {
        this.cloneReq = !!sessionStorage.getItem('access_token') ? req.clone({url: req.url + `?access_token=${sessionStorage.getItem('access_token')}&tenantId=${sessionStorage.getItem('tenantId')}`}) : req.clone(req);
      }
    }
    return next.handle(this.cloneReq).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (this.cloneReq.url.split('/').pop().substring(0, 16) !== 'balancescorecard') {
            if (this.cloneReq.method === 'POST' && evt.body && evt.body.status === '0') {
              this.toasterService.success('Saved Successfully');
            }
            if (this.cloneReq.method === 'POST' && evt.body && evt.body.status === '1') {
              this.toasterService.error('Already Exists');
            }
            if (this.cloneReq.method === 'PUT' && evt.body && evt.body.status === '0') {
              this.toasterService.success('Updated Successfully');
            }
            if (this.cloneReq.method === 'DELETE' && evt.body && evt.body.status === '0') {
              this.toasterService.success('Deleted Successfully');
            }
          }
          this.loaderService.hide();
        }

      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status > 400) {
            this.router.navigate(['/error']);
            this.loaderService.hide();
          }
        }
      }));
  }
}
