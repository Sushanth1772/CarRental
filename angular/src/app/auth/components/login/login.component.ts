import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { NzMessageService } from "ng-zorro-antd/message";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isSpinning: boolean = false;
  loginform!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router) { }

  ngOnInit() {
    this.loginform = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  login() {
    this.isSpinning = true; // Show spinner
    console.log(this.loginform.value);
    this.authService.login(this.loginform.value).subscribe(
      (res) => {
        console.log(res);
        if (res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole
          }
          StorageService.saveToken(res.jwt);
          StorageService.saveUser(user);
          if (StorageService.isAdminLoggedIn())
            this.router.navigateByUrl("/admin/dashboard");
          else
            this.router.navigateByUrl("/customer/dashboard");
        } else {
          this.message.error("Bad credentials", { nzDuration: 5000 });
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        console.error(error);
        this.message.error("Invalid email or password", { nzDuration: 5000 });
        this.isSpinning = false; // Hide spinner
      }
    );
  }
}
