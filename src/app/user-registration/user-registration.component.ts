import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({});
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: [''],
      preferredContact: ['email'],
    });

    this.registrationForm.addValidators(this.customValidation);
  }

  customValidation(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    const preferredContact = form.get('preferredContact');
    const email = form.get('email');
    const phoneNumber = form.get('phoneNumber');

    let errors: ValidationErrors = {};

    if (password?.value !== confirmPassword?.value) {
      errors['passwordMismatch'] = true;
    }

    if (preferredContact?.value === 'email' && !email?.value) {
      errors['emailRequired'] = true;
    } else if (preferredContact?.value === 'phone' && !phoneNumber?.value) {
      errors['phoneRequired'] = true;
    }

    if ((preferredContact?.value === 'email' && !email?.value) ||
        (preferredContact?.value === 'phone' && !phoneNumber?.value)) {
      errors['requiredContact'] = true;
    }

    if (preferredContact?.value === 'phone' && !phoneNumber?.value) {
      errors['noContactProvided'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      this.registrationForm.reset();
    }
  }
}
