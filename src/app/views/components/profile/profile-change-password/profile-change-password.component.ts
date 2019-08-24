import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.scss']
})
export class ProfileChangePasswordComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    }, { validator: this.validatePassword });
  }

  onBtnChangeClicked() {
    const { password, newPassword, confirmNewPassword } = this.formGroup.value;

    this.authService.changePassword(password, newPassword).subscribe(res => {
      alert('Password changed successfully.');
      this.authService.logout();
      this.router.navigate(['/pages/login']);
    }, err => this.alertService.error(JSON.stringify(err.error.message)));
  }

  validatePassword(formGroup: FormGroup) {
    const { password, newPassword, confirmNewPassword } = formGroup.value;

    const error = {
      samePassword: null,
    };
    if (!password) {
      error.samePassword = { message: 'Password cannot be empty.' };
      return error;
    }
    if (!newPassword) {
      error.samePassword = { message: 'New Password cannot be empty.' };
      return error;
    }
    if (!confirmNewPassword) {
      error.samePassword = { message: 'Confirm New Password cannot be empty.' };
      return error;
    }
    if (password === newPassword) {
      error.samePassword = { message: 'New Password cannot be the same as Password.' };
      return error;
    }
    if (newPassword !== confirmNewPassword) {
      error.samePassword = { message: 'New Password needs to be the same as Confirm New Password.' };
      return error;
    }
    return null;
  }
}
