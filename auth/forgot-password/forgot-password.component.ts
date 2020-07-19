import {Component, OnInit} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {FormBuilder} from '@angular/forms';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  emailNotifMsg: any;

  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private customValidators: CustomValidators) {
  }

  forgotPasswordForm = this.formBuilder.group({
    email: ['', this.customValidators.required]
  });

  ngOnInit() {
  }

  sendForgotPasswordEmail() {
    this.bscRestService.sendForgotPasswordEmail(this.forgotPasswordForm.controls.email.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.emailNotifMsg = 'Email Sent Successfully';
        this.forgotPasswordForm.reset();
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
