import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Module } from '@domain/module';

/**
 * Module Item Component
 * Displays a single sidebar module with icon, badge, and active state
 */
@Component({
  selector: 'app-module-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <a
      [class.active]="isActive()"
      [matTooltip]="collapsed() ? module().name : ''"
      matTooltipPosition="right"
      (click)="moduleClick.emit(module())"
    >
      <mat-icon>{{ module().icon }}</mat-icon>
      
      @if (!collapsed()) {
        <span class="module-name">{{ module().name }}</span>
      }
      
      @if (module().badge && module().badge!.type !== 'none') {
        @if (module().badge!.type === 'count' && module().badge!.count) {
          <span 
            class="module-badge"
            [class]="'badge-' + module().badge!.color"
          >
            {{ module().badge!.count }}
          </span>
        } @else if (module().badge!.type === 'dot') {
          <span 
            class="module-badge-dot"
            [class]="'badge-' + module().badge!.color"
          ></span>
        }
      }
    </a>
  `,
  styles: [`
    :host {
      display: block;
    }

    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: var(--mat-sys-on-surface);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        background-color: var(--mat-sys-surface-container);
      }

      &.active {
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }
    }

    mat-icon {
      flex-shrink: 0;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .module-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .module-badge {
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.badge-primary {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }
      
      &.badge-accent {
        background-color: var(--mat-sys-secondary);
        color: var(--mat-sys-on-secondary);
      }
      
      &.badge-warn {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }
      
      &.badge-success {
        background-color: #4caf50;
        color: white;
      }
      
      &.badge-info {
        background-color: #2196f3;
        color: white;
      }
    }

    .module-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      
      &.badge-primary {
        background-color: var(--mat-sys-primary);
      }
      
      &.badge-accent {
        background-color: var(--mat-sys-secondary);
      }
      
      &.badge-warn {
        background-color: var(--mat-sys-error);
      }
      
      &.badge-success {
        background-color: #4caf50;
      }
      
      &.badge-info {
        background-color: #2196f3;
      }
    }
  `]
})
export class ModuleItemComponent {
  // Inputs
  module = input.required<Module>();
  collapsed = input<boolean>(false);
  active = input<boolean>(false);

  // Computed
  isActive = computed(() => this.active());

  // Outputs
  moduleClick = output<Module>();
}
