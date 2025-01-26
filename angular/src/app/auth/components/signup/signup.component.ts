import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message'; // Import NzMessageService for showing messages

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  isSpinning: boolean = false;
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService // Inject NzMessageService
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: [null, [Validators.required, this.confirmationValidate]],
    });
  }

  confirmationValidate = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signupForm.controls['password'].value) {
      return { confirm: true};
    }
    return {};
  };

  signup() {
    this.isSpinning = true; // Show spinner
    console.log(this.signupForm.value);
    this.authService.register(this.signupForm.value).subscribe(
      (res) => {
        console.log(res);
        this.message.success('Registration successful!', { nzDuration: 5000 }); // Show success message
        this.router.navigateByUrl('/login');
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        console.error(error);
          this.message.error('Registration failed. Please try again.', { nzDuration: 5000 }); // Generic error message
        this.isSpinning = false; // Hide spinner
      }
    );
  }
}