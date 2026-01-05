import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
  ],
  template: `
    <div class="login-container">
      <p-card header="Sign In" class="login-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          @if (error$ | async; as error) {
            <p-message severity="error" [text]="error" class="error-message" />
          }

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
              [feedback]="false"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              autocomplete="current-password"
            />
            @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
              <small class="p-error">Password is required</small>
            }
          </div>

          <p-button
            type="submit"
            label="Sign In"
            [loading]="(loading$ | async) ?? false"
            [disabled]="form.invalid || (loading$ | async)"
            styleClass="w-full"
          />
        </form>
      </p-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1rem;
      }

      .login-card {
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
    `,
  ],
})
export class LoginComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.store.dispatch(AuthActions.login({ email, password }));
    }
  }
}
