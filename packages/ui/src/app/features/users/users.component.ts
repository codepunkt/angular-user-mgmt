import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  type TableLazyLoadEvent,
  TableModule,
  type TableRowSelectEvent,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import type { User } from '../../core/models/user.model';
import { AuthActions } from '../../store/auth/auth.actions';
import {
  selectCurrentUser,
  selectIsAdmin,
} from '../../store/auth/auth.selectors';
import { UsersActions } from '../../store/users/users.actions';
import {
  selectLimit,
  selectOffset,
  selectSelectedUser,
  selectTotalCount,
  selectUsers,
  selectUsersLoading,
} from '../../store/users/users.selectors';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    EditUserDialogComponent,
  ],
  template: `
    <p-toast />

    <div class="users-container">
      <p-toolbar styleClass="mb-4">
        <div class="p-toolbar-group-start">
          <h2 class="m-0">User Management</h2>
        </div>
        <div class="p-toolbar-group-end">
          @if (currentUser$ | async; as user) {
            <span class="mr-3">{{ user.name }}</span>
          }
          <p-button
            label="Sign Out"
            icon="pi pi-sign-out"
            severity="secondary"
            (onClick)="onLogout()"
          />
        </div>
      </p-toolbar>

      <p-card>
        <p-table
          [value]="(users$ | async) ?? []"
          [loading]="(loading$ | async) ?? false"
          [paginator]="true"
          [rows]="(limit$ | async) ?? 10"
          [totalRecords]="(totalCount$ | async) ?? 0"
          [lazy]="true"
          [first]="(offset$ | async) ?? 0"
          (onLazyLoad)="onPageChange($event)"
          [rowsPerPageOptions]="[5, 10, 25]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          [selectionMode]="(isAdmin$ | async) ? 'single' : null"
          (onRowSelect)="onRowSelect($event)"
          dataKey="id"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Preferred Name</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Created</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr
              [pSelectableRow]="user"
              [class.cursor-pointer]="isAdmin$ | async"
            >
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.preferredName || '-' }}</td>
              <td>
                <p-tag
                  [value]="user.role"
                  [severity]="user.role === 'ADMIN' ? 'danger' : 'info'"
                />
              </td>
              <td>
                <p-tag
                  [value]="user.emailVerified ? 'Yes' : 'No'"
                  [severity]="user.emailVerified ? 'success' : 'warn'"
                />
              </td>
              <td>{{ user.createdAt | date: 'short' }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center">No users found.</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    @if (selectedUser$ | async; as selectedUser) {
      <app-edit-user-dialog
        [user]="selectedUser"
        [visible]="true"
        (visibleChange)="onDialogClose()"
      />
    }
  `,
  styles: [
    `
      .users-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .cursor-pointer {
        cursor: pointer;
      }

      .mr-3 {
        margin-right: 1rem;
      }

      .mb-4 {
        margin-bottom: 1.5rem;
      }

      .m-0 {
        margin: 0;
      }

      .text-center {
        text-align: center;
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  private store = inject(Store);

  users$ = this.store.select(selectUsers);
  totalCount$ = this.store.select(selectTotalCount);
  offset$ = this.store.select(selectOffset);
  limit$ = this.store.select(selectLimit);
  loading$ = this.store.select(selectUsersLoading);
  isAdmin$ = this.store.select(selectIsAdmin);
  currentUser$ = this.store.select(selectCurrentUser);
  selectedUser$ = this.store.select(selectSelectedUser);

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers({}));
  }

  onPageChange(event: TableLazyLoadEvent): void {
    this.store.dispatch(
      UsersActions.loadUsers({
        offset: event.first ?? 0,
        limit: event.rows ?? 10,
      }),
    );
  }

  onRowSelect(event: TableRowSelectEvent<User>): void {
    if (event.data && !Array.isArray(event.data)) {
      this.store.dispatch(UsersActions.selectUser({ user: event.data }));
    }
  }

  onDialogClose(): void {
    this.store.dispatch(UsersActions.clearSelectedUser());
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
