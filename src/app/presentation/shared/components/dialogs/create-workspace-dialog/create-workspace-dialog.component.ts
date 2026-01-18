import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { AuthStore } from '@application/auth/stores/auth.store';
import { OrganizationStore } from '@application/organization/stores/organization.store';
import { Router } from '@angular/router';
import { Workspace } from '@domain/workspace/entities/workspace.entity';

/**
 * Create Workspace Dialog Component
 * 
 * Allows users to create a new workspace with:
 * - Workspace name (required)
 * - Description (optional)
 * - Workspace type selection (optional)
 * 
 * Form validation:
 * - Name: required, min 3 chars, max 50 chars
 * - Description: max 200 chars
 */
@Component({
  selector: 'app-create-workspace-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './create-workspace-dialog.component.html',
  styleUrl: './create-workspace-dialog.component.scss'
})
export class CreateWorkspaceDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateWorkspaceDialogComponent>);
  private fb = inject(FormBuilder);
  private workspaceStore = inject(WorkspaceStore);
  private authStore = inject(AuthStore);
  private organizationStore = inject(OrganizationStore);
  private router = inject(Router);

  // Form
  workspaceForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(200)]]
  });

  // State
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  /**
   * Create workspace
   */
  async createWorkspace(): Promise<void> {
    if (this.workspaceForm.invalid) {
      this.workspaceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    try {
      const formValue = this.workspaceForm.value;
      const currentUser = this.authStore.user();
      const currentOrg = this.organizationStore.currentOrganization();
      
      if (!currentUser || !currentOrg) {
        throw new Error('User or organization not found');
      }

      // Create workspace object with all required fields
      const workspaceData: Omit<Workspace, 'id'> = {
        organizationId: currentOrg.id,
        name: formValue.name,
        displayName: formValue.displayName,
        description: formValue.description || '',
        ownerId: currentUser.id,
        modules: {
          overview: true,
          documents: true,
          tasks: true,
          members: true,
          permissions: true,
          audit: false,
          settings: true,
          journal: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active' as const,
      };

      this.workspaceStore.createWorkspace(workspaceData);
      
      // Close dialog immediately - the store will handle the navigation
      this.dialogRef.close(true);
    } catch (err) {
      console.error('Failed to create workspace:', err);
      this.error.set('Failed to create workspace. Please try again.');
      this.isSubmitting.set(false);
    }
  }

  /**
   * Close dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.workspaceForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    }
    if (field.errors['maxlength']) {
      return `Maximum ${field.errors['maxlength'].requiredLength} characters allowed`;
    }
    return '';
  }
}
