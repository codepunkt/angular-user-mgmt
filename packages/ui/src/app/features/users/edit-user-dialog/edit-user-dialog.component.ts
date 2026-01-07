import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  inject,
  type OnChanges,
  Output,
  type SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { take } from 'rxjs';

import type { User, UserRole } from '../../../core/models/user.model';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { UsersActions } from '../../../store/users/users.actions';
import {
  selectUpdateError,
  selectUpdateLoading,
} from '../../../store/users/users.selectors';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    MessageModule,
  ],
  template: `
    <p-dialog
      header="Edit User"
      [(visible)]="dialogVisible"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [style]="{ width: '450px' }"
      (onHide)="onClose()"
    >
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
          />
          @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) {
            <small class="p-error">Name is required</small>
          }
        </div>

        <div class="field">
          <label for="preferredName">Preferred Name</label>
          <input
            id="preferredName"
            type="text"
            pInputText
            formControlName="preferredName"
            class="w-full"
          />
        </div>

        <div class="field">
          <label>Role</label>
          <div class="role-options">
            <div class="role-option">
              <p-radioButton
                inputId="role-user"
                value="USER"
                formControlName="role"
              />
              <label for="role-user">User</label>
            </div>
            <div class="role-option">
              <p-radioButton
                inputId="role-admin"
                value="ADMIN"
                formControlName="role"
              />
              <label for="role-admin">Admin</label>
            </div>
          </div>
          @if (isEditingSelf) {
            <small class="role-hint">You cannot change your own role</small>
          }
        </div>
      </form>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          severity="secondary"
          (onClick)="onClose()"
          [disabled]="(loading$ | async) ?? false"
        />
        <p-button
          label="Save"
          (onClick)="onSubmit()"
          [loading]="(loading$ | async) ?? false"
          [disabled]="form.invalid || !(form.dirty)"
        />
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
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
        color: var(--red-500);
      }

      .role-options {
        display: flex;
        gap: 1.5rem;
      }

      .role-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .role-option label {
        margin-bottom: 0;
        cursor: pointer;
      }

      .role-hint {
        display: block;
        margin-top: 0.5rem;
        color: var(--text-color-secondary);
      }
    `,
  ],
})
export class EditUserDialogComponent implements OnChanges {
  @Input() user!: User;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  dialogVisible = false;
  isEditingSelf = false;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private currentUser$ = this.store.select(selectCurrentUser);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    preferredName: [''],
    role: ['USER' as UserRole],
  });

  loading$ = this.store.select(selectUpdateLoading);
  error$ = this.store.select(selectUpdateError);

  ngOnChanges(changes: SimpleChanges): void {
    // biome-ignore lint/complexity/useLiteralKeys: SimpleChanges requires bracket notation
    if (changes['visible']) {
      this.dialogVisible = this.visible;
    }
    // biome-ignore lint/complexity/useLiteralKeys: SimpleChanges requires bracket notation
    if (changes['user'] && this.user) {
      this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
        this.isEditingSelf = currentUser?.id === this.user.id;
        if (this.isEditingSelf) {
          this.form.get('role')?.disable();
        } else {
          this.form.get('role')?.enable();
        }
      });
      this.form.patchValue({
        name: this.user.name,
        preferredName: this.user.preferredName ?? '',
        role: this.user.role,
      });
      this.form.markAsPristine();
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.form.dirty) {
      const payload = {
        id: this.user.id,
        ...this.form.value,
        preferredName: this.form.value.preferredName || null,
      };
      this.store.dispatch(UsersActions.updateUser({ payload }));
    }
  }

  onClose(): void {
    this.store.dispatch(UsersActions.clearUpdateError());
    this.visibleChange.emit(false);
  }
}
