import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { WorkspaceFacade } from '@application/workspace/facades/workspace.facade';

/**
 * Create Workspace Dialog Component
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  PRESENTATION LAYER: Workspace Creation Form UI                  ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL COMPLIANCE:
 * =========================
 * ✅ Uses WorkspaceFacade.createWorkspace() for orchestration
 * ✅ NO direct store imports (AuthStore, OrganizationStore, WorkspaceStore)
 * ✅ NO business logic (validation, object construction)
 * ✅ Expresses user intent only (createWorkspace with form data)
 * 
 * Allows users to create a new workspace with:
 * - Workspace name (required)
 * - Display name (required)
 * - Description (optional)
 * 
 * Form validation:
 * - Name: required, min 3 chars, max 50 chars
 * - DisplayName: required, min 3 chars, max 50 chars
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
  
  // FACADE for workspace creation orchestration
  private workspaceFacade = inject(WorkspaceFacade);

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
   * 
   * ARCHITECTURAL COMPLIANCE:
   * =========================
   * ✅ Delegates to WorkspaceFacade.createWorkspace()
   * ✅ Facade handles:
   *    - Auth/Organization context validation
   *    - Workspace object construction
   *    - Store creation call
   *    - UX feedback (snackbar)
   *    - Navigation on success
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
      
      // Delegate to facade for complete orchestration
      this.workspaceFacade.createWorkspace({
        name: formValue.name,
        displayName: formValue.displayName,
        description: formValue.description || ''
      });
      
      // Close dialog - facade handles navigation
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
