import {Component, OnInit} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {PasswordValidation} from '../../shared/utils/password-validator';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  submitted = false;
  resetPasswordForm: FormGroup;
  private route: ActivatedRouteSnapshot;
  resetToken: any;

  get resetForm() {
    return this.resetPasswordForm.controls;
  }

  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetToken = params['token'] ? params['token'] : null;
    });
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  resetPassword() {
    if (this.resetPasswordForm.valid && !!this.resetToken) {
      this.bscRestService.resetPassword(this.resetPasswordForm.controls.confirmPassword.value, this.resetToken).subscribe((data: any) => {
        if (data.status === '0') {
          this.resetPasswordForm.reset();
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    } else {
      this.toastrService.error('Please retry forgot password again');
    }
  }
}
