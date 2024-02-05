import { Component, OnInit } from '@angular/core';
import { ResetPassword } from '../../models/reset-password.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from '../../helpers/confirm-password.validator';
import ValidateForm from '../../helpers/validateform';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.activatedRoute.queryParams.subscribe((val) => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword =
        this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toastr.error(
            err?.message ? `${err.message}` : 'Something went wrong'
          );
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
