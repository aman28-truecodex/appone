import {Component, OnInit} from '@angular/core';
import {AppService} from '../../shared/app.service';
import {FormBuilder, Validators} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {HttpResponse} from '@angular/common/http';
import {LoaderService} from '../../shared/loader.service';
import {mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  onKeydown: boolean;
  InvalidUser: string = null;
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    grant_type: ['password']
  });

  constructor(private appService: AppService,
              private formBuilder: FormBuilder,
              private bscRestService: BscRestService,
              private http: HttpClient,
              private customValidators: CustomValidators,
              private emitterService: EmitterService,
              private loaderService: LoaderService,
              private router: Router) {
    this.onKeydown = true;
  }

  ngOnInit() {
    sessionStorage.clear();
  }

  RedirectToDashboard() {
    const formData: any = new FormData();
    if (this.loginForm.valid) {
      formData.append('username', this.loginForm.get('username').value);
      formData.append('password', this.loginForm.get('password').value);
      formData.append('grant_type', this.loginForm.get('grant_type').value);
      formData.append('client_id', 'client');
      formData.append('client_secret', 'secret');
      const user = this.loginForm.get('username').value;

      this.http.get(`https://dev.fruisce.in/bsc/api/user/email/${user}`).subscribe((data: any) => {
        if (data.status === '0') {
          sessionStorage.setItem('tenantId', data.data['tenantId']);
          this.http.post(`https://dev.fruisce.in/bsc/oauth/token?tenantId=${sessionStorage.getItem('tenantId')}`, formData).subscribe(
            (response: HttpResponse<any>) => {
              if (!!response['access_token']) {
                sessionStorage.setItem('access_token', response['access_token']);

                this.router.navigate(['/dashboard']);
                this.getOrganizations();
              }
            }, err => {
              this.InvalidUser = 'Incorrect Credentials!';
              this.loaderService.hide();
            }
          );
        } else {
          this.InvalidUser = 'No User Exist with given Email Id!';
          this.loaderService.hide();
        }
      });
    }
  }

  getOrganizations() {
    this.bscRestService.getCodeAndName().subscribe((data: any) => {
      if (data.status === '0') {
        this.emitterService.broadcastOrgUnitCode(data.data['OrganisationList']);
      }
    });
  }

  preventAfterSubmit() {
    return this.onKeydown;
  }

}
