import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthActions } from '../../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectRegistrationPending,
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
  ],
  template: `
    <div class="register-container">
      <p-card header="Create Account" class="register-card">
        @if (registrationPending$ | async) {
          <div class="success-container">
            <i class="pi pi-envelope success-icon"></i>
            <h3>Check your email</h3>
            <p>We've sent a verification link to your email address. Please click the link to verify your account.</p>
            <a routerLink="/login" class="link">Back to Sign In</a>
          </div>
        } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          @if (error$ | async; as error) {
            <p-message severity="error" [text]="error" class="error-message" />
          }

          <div class="field">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              pInputText
              formControlName="name"
              class="w-full"
              autocomplete="name"
            />
            @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) {
              <small class="p-error">Name is required</small>
            }
          </div>

          <div class="field">
            <label for="preferredName">Preferred Name (optional)</label>
            <input
              id="preferredName"
              type="text"
              pInputText
              formControlName="preferredName"
              class="w-full"
              autocomplete="nickname"
            />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              class="w-full"
              autocomplete="email"
            />
            @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
              <small class="p-error">Email is required</small>
            }
            @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
              <small class="p-error">Invalid email format</small>
            }
          </div>

          <div class="field">
            <label for="password">Password</label>
            <p-password
              id="password"
              formControlName="password"
              [feedback]="true"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              autocomplete="new-password"
            />
            @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
              <small class="p-error">Password is required</small>
            }
            @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
              <small class="p-error">Password must be at least 8 characters</small>
            }
          </div>

          <p-button
            type="submit"
            label="Create Account"
            [loading]="(loading$ | async) ?? false"
            [disabled]="form.invalid || (loading$ | async)"
            styleClass="w-full"
          />

          <div class="login-link">
            Already have an account?
            <a routerLink="/login" class="link">Sign in</a>
          </div>
        </form>
        }
      </p-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1rem;
      }

      .register-card {
        width: 100%;
        max-width: 400px;
      }

      .field {
        margin-bottom: 1.5rem;
      }

      .field label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .error-message {
        margin-bottom: 1rem;
        display: block;
      }

      .w-full {
        width: 100%;
      }

      .p-error {
        display: block;
        margin-top: 0.25rem;
      }

      .login-link {
        margin-top: 1.5rem;
        text-align: center;
        color: var(--text-color-secondary);
      }

      .link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
      }

      .link:hover {
        text-decoration: underline;
      }

      .success-container {
        text-align: center;
        padding: 1rem 0;
      }

      .success-icon {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      .success-container h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
      }

      .success-container p {
        margin: 0 0 1.5rem 0;
        color: var(--text-color-secondary);
      }
    `,
  ],
})
export class RegisterComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    preferredName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  registrationPending$ = this.store.select(selectRegistrationPending);

  onSubmit(): void {
    if (this.form.valid) {
      const { name, preferredName, email, password } = this.form.value;
      this.store.dispatch(
        AuthActions.register({
          name,
          email,
          password,
          preferredName: preferredName || null,
        }),
      );
    }
  }
}
