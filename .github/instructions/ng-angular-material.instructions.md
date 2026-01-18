---
description: 'Angular Material component library best practices for building Material Design UIs in Angular 20+ applications'
applyTo: '**/*.ts, **/*.html'
---

# Angular Material Component Guidelines

## Overview

Angular Material is the official Material Design component library for Angular. This guide covers best practices for using Material components in Angular 20+ standalone applications.

## General Principles

### 1. Modular Imports

**Always import specific component modules:**
```typescript
// ✅ Good - Import specific modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  // ...
})
export class FeatureComponent {}

// ❌ Bad - Don't wildcard import
import * as Material from '@angular/material';
```

### 2. Animation Configuration

**Provide animations in standalone apps:**
```typescript
// app.config.ts
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // or provideNoopAnimations() for testing
  ]
};
```

### 3. Theme Integration

**Ensure Material theme is loaded:**
```scss
// styles.scss
@use '@angular/material' as mat;
@include mat.core();
@include mat.all-component-themes($my-theme);
```

## Component Best Practices

### Form Controls

#### Input Fields

```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput [formControl]="email" placeholder="user@example.com">
      <mat-icon matPrefix>email</mat-icon>
      <mat-hint>We'll never share your email</mat-hint>
      @if (email.hasError('required')) {
        <mat-error>Email is required</mat-error>
      }
      @if (email.hasError('email')) {
        <mat-error>Invalid email format</mat-error>
      }
    </mat-form-field>
  `
})
export class EmailInputComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
}
```

**Form Field Appearances:**
- `fill` - Default filled appearance
- `outline` - Outlined appearance (recommended for most cases)

#### Select Dropdowns

```typescript
import { MatSelectModule } from '@angular/material/select';

@Component({
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Country</mat-label>
      <mat-select [formControl]="country">
        @for (country of countries; track country.code) {
          <mat-option [value]="country.code">
            {{ country.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `
})
export class CountrySelectComponent {
  country = new FormControl('');
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    // ...
  ];
}
```

#### Date Pickers

```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';

// In app.config.ts
providers: [
  provideNativeDateAdapter()
]

// In component
<mat-form-field appearance="outline">
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date">
  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

### Buttons

**Use appropriate button variants:**
```html
<!-- Basic button -->
<button mat-button>Basic</button>

<!-- Raised button (primary actions) -->
<button mat-raised-button color="primary">Save</button>

<!-- Flat button -->
<button mat-flat-button color="accent">Accent</button>

<!-- Stroked button (secondary actions) -->
<button mat-stroked-button>Cancel</button>

<!-- Icon button -->
<button mat-icon-button aria-label="Delete">
  <mat-icon>delete</mat-icon>
</button>

<!-- FAB (floating action button) -->
<button mat-fab color="primary">
  <mat-icon>add</mat-icon>
</button>

<!-- Mini FAB -->
<button mat-mini-fab color="accent">
  <mat-icon>edit</mat-icon>
</button>
```

### Navigation Components

#### Toolbar

```typescript
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>{{ title }}</span>
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent {
  title = 'My App';
  toggleSidenav = output<void>();
}
```

#### Sidenav

```typescript
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    
    .sidenav {
      width: 250px;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class SidenavLayoutComponent {
  navItems = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/profile', icon: 'person', label: 'Profile' },
    { route: '/settings', icon: 'settings', label: 'Settings' }
  ];
}
```

### Data Display

#### Tables

```typescript
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let user">{{ user.name }}</td>
      </ng-container>
      
      <!-- Email Column -->
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
        <td mat-cell *matCellDef="let user">{{ user.email }}</td>
      </ng-container>
      
      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user">
          <button mat-icon-button (click)="editUser(user)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteUser(user)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    
    <mat-paginator 
      [length]="totalItems"
      [pageSize]="pageSize"
      [pageSizeOptions]="[10, 25, 50, 100]"
      (page)="onPageChange($event)">
    </mat-paginator>
  `
})
export class UserTableComponent {
  displayedColumns = ['name', 'email', 'actions'];
  dataSource = signal<User[]>([]);
  totalItems = signal(0);
  pageSize = 10;
  
  onSort(sort: Sort) {
    // Handle sorting
  }
  
  onPageChange(event: PageEvent) {
    // Handle pagination
  }
}
```

#### Cards

```typescript
import { MatCardModule } from '@angular/material/card';

@Component({
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          <img [src]="avatarUrl" alt="Avatar">
        </div>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      
      @if (imageUrl) {
        <img mat-card-image [src]="imageUrl" [alt]="title">
      }
      
      <mat-card-content>
        <p>{{ content }}</p>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button>LIKE</button>
        <button mat-button>SHARE</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class PostCardComponent {
  title = input.required<string>();
  subtitle = input<string>();
  content = input.required<string>();
  imageUrl = input<string>();
  avatarUrl = input<string>();
}
```

### Dialogs and Overlays

#### Dialog

```typescript
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Dialog Component
@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        Confirm
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
}

// Parent Component
export class ParentComponent {
  private dialog = inject(MatDialog);
  
  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed');
      }
    });
  }
}
```

#### Snackbar

```typescript
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snackbar';

export class NotificationService {
  private snackBar = inject(MatSnackBar);
  
  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
  
  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
```

## Accessibility Best Practices

### 1. ARIA Labels

```html
<!-- ✅ Good - Provide aria-label for icon buttons -->
<button mat-icon-button aria-label="Delete item">
  <mat-icon>delete</mat-icon>
</button>

<!-- ✅ Good - Use mat-label for form fields -->
<mat-form-field>
  <mat-label>Email Address</mat-label>
  <input matInput type="email">
</mat-form-field>
```

### 2. Keyboard Navigation

```typescript
// Ensure all interactive elements are keyboard accessible
<mat-menu>
  <button mat-menu-item (keydown.enter)="action()">
    Action
  </button>
</mat-menu>
```

### 3. Focus Management

```typescript
import { FocusMonitor } from '@angular/cdk/a11y';

export class MyComponent {
  private focusMonitor = inject(FocusMonitor);
  
  ngAfterViewInit() {
    this.focusMonitor.monitor(this.elementRef, true);
  }
  
  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
```

## Performance Optimization

### 1. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedComponent {
  // Use signals for automatic change detection
  data = signal<Data[]>([]);
}
```

### 2. Virtual Scrolling for Large Lists

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      @for (item of items(); track item.id) {
        <mat-list-item>{{ item.name }}</mat-list-item>
      }
    </cdk-virtual-scroll-viewport>
  `
})
```

### 3. Lazy Load Modules

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent)
  }
];
```

## Testing

### Component Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideAnimations()]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Common Pitfalls to Avoid

### 1. Missing Animations
```typescript
// ❌ Bad - No animations provider
// Material components won't animate

// ✅ Good - Provide animations
providers: [provideAnimations()]
```

### 2. Missing Form Field Wrapper
```html
<!-- ❌ Bad - Input without mat-form-field -->
<input matInput>

<!-- ✅ Good - Wrapped in mat-form-field -->
<mat-form-field>
  <input matInput>
</mat-form-field>
```

### 3. Not Using trackBy
```html
<!-- ❌ Bad - No tracking -->
@for (item of items(); track item.id) {
  <mat-list-item>{{ item.name }}</mat-list-item>
}

<!-- ✅ Good - With trackBy -->
@for (item of items(); track item.id) {
  <mat-list-item>{{ item.name }}</mat-list-item>
}
```

## Resources

- [Angular Material Documentation](https://material.angular.io/)
- [Component API Reference](https://material.angular.io/components/categories)
- [Accessibility Guide](https://material.angular.io/guide/accessibility)
