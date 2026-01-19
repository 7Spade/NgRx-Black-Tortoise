import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthStore } from '@application/auth/stores/auth.store';
import { HeaderComponent } from '@presentation/shared/components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatCardModule],
  template: `
    <div class="dashboard">
      <app-header></app-header>

      <main class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome to Dashboard</h1>
          @if (authStore.user()) {
            <p class="user-email">
              Logged in as: {{ authStore.user()?.email }}
            </p>
          }
        </div>

        <!-- Cards removed as requested -->
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background-color: var(--mat-sys-surface-container-low);
      }

      .dashboard-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .welcome-section {
        margin-bottom: 40px;
      }

      h1 {
        font: var(--mat-sys-headline-medium);
        margin: 0 0 10px;
      }

      .user-email {
        color: var(--mat-sys-on-surface-variant);
        font: var(--mat-sys-body-small);
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
      }

      .dashboard-card {
        box-shadow: var(--mat-sys-level1);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        cursor: pointer;
      }

      .dashboard-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--mat-sys-level3);
      }

      .card-icon {
        font-size: 32px;
        background: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .cards-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  protected authStore = inject(AuthStore);
}
