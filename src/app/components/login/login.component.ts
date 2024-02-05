import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from '../../services/user-store.service';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.toastr.success('Login Successfully');
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          let decodedValue = this.auth.decodedToken();
          this.userStore.setFullNameForStore(decodedValue.name);
          this.userStore.setRoleForStore(decodedValue.role);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.toastr.error(err?.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      this.toastr.error('Your form is invalid');
    }
  }

  checkValidEmail(event: any) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);

      this.resetService
        .setResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.toastr.success('Reset Success!');
            this.resetPasswordEmail = '';
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
          },
          error: (err) => {
            this.toastr.error(
              err?.message ? `${err.message}` : 'Something went wrong'
            );
          },
        });
    }
  }
}
