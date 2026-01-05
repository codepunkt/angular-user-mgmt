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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import type { User, UserRole } from '../../../core/models/user.model';
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
    DropdownModule,
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
          <label for="role">Role</label>
          <p-dropdown
            id="role"
            formControlName="role"
            [options]="roleOptions"
            optionLabel="label"
            optionValue="value"
            styleClass="w-full"
          />
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
    `,
  ],
})
export class EditUserDialogComponent implements OnChanges {
  @Input() user!: User;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  dialogVisible = false;

  private store = inject(Store);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    preferredName: [''],
    role: ['USER' as UserRole],
  });

  roleOptions: { label: string; value: UserRole }[] = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' },
  ];

  loading$ = this.store.select(selectUpdateLoading);
  error$ = this.store.select(selectUpdateError);

  ngOnChanges(changes: SimpleChanges): void {
    // biome-ignore lint/complexity/useLiteralKeys: SimpleChanges requires bracket notation
    if (changes['visible']) {
      this.dialogVisible = this.visible;
    }
    // biome-ignore lint/complexity/useLiteralKeys: SimpleChanges requires bracket notation
    if (changes['user'] && this.user) {
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
