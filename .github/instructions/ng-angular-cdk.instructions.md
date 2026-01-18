---
description: 'Angular CDK (Component Dev Kit) best practices for building accessible custom components with overlays, drag-drop, virtual scrolling, and layout utilities'
applyTo: '**/*.ts, **/*.html'
---

# Angular CDK Component Development Guidelines

## Overview

Angular CDK provides behavior primitives for building accessible, high-quality UI components without Material Design styling. Use CDK when building custom components from scratch.

## Core Modules

### 1. Accessibility (A11y)

#### Focus Management

```typescript
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';

export class DialogComponent implements OnInit, OnDestroy {
  private focusTrap: FocusTrap;
  
  constructor(
    private focusTrapFactory: FocusTrapFactory,
    private elementRef: ElementRef
  ) {}
  
  ngOnInit() {
    this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    this.focusTrap.focusInitialElement();
  }
  
  ngOnDestroy() {
    this.focusTrap.destroy();
  }
}
```

#### Live Announcer for Screen Readers

```typescript
import { LiveAnnouncer } from '@angular/cdk/a11y';

export class NotificationComponent {
  constructor(private liveAnnouncer: LiveAnnouncer) {}
  
  announceMessage(message: string, politeness: 'polite' | 'assertive' = 'polite') {
    this.liveAnnouncer.announce(message, politeness);
  }
}
```

#### Keyboard Navigation with ListKeyManager

```typescript
import { FocusKeyManager } from '@angular/cdk/a11y';
import { QueryList, ViewChildren } from '@angular/core';

export class MenuComponent implements AfterViewInit {
  @ViewChildren(MenuItem) menuItems: QueryList<MenuItem>;
  private keyManager: FocusKeyManager<MenuItem>;
  
  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager(this.menuItems)
      .withWrap()
      .withVerticalOrientation()
      .withHomeAndEnd();
  }
  
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);
  }
}
```

### 2. Overlay

```typescript
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export class TooltipDirective {
  private overlayRef: OverlayRef | null = null;
  
  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef
  ) {}
  
  show() {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 8
          }
        ]),
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    
    this.overlayRef = this.overlay.create(config);
    const portal = new ComponentPortal(TooltipComponent);
    this.overlayRef.attach(portal);
  }
  
  hide() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
```

### 3. Drag and Drop

```typescript
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)">
      @for (item of items; track item.id) {
        <div cdkDrag>
          <div class="drag-handle" cdkDragHandle>⋮⋮</div>
          {{ item.name }}
          <div *cdkDragPreview>{{ item.name }} (dragging)</div>
        </div>
      }
    </div>
  `
})
export class SortableListComponent {
  items = signal([...]);
  
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items(), event.previousIndex, event.currentIndex);
  }
}
```

### 4. Virtual Scrolling

```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      @for (item of items; track item.id) {
        <div class="item">{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 400px;
      width: 100%;
    }
    .item {
      height: 50px;
      display: flex;
      align-items: center;
    }
  `]
})
export class VirtualScrollComponent {
  items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
}
```

### 5. Breakpoint Observer

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export class ResponsiveComponent {
  private breakpointObserver = inject(BreakpointObserver);
  
  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
  
  columns = computed(() => this.isHandset() ? 1 : 3);
}
```

## Best Practices

### 1. Always Trap Focus in Modals

```typescript
// ✅ Good - Trap focus
ngOnInit() {
  this.focusTrap = this.focusTrapFactory.create(this.element.nativeElement);
  this.focusTrap.focusInitialElement();
}

// ❌ Bad - No focus management
```

### 2. Use Flexible Positioning for Overlays

```typescript
// ✅ Good - Multiple fallback positions
const positions = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
];
```

### 3. Configure Virtual Scroll Buffers

```typescript
// ✅ Good - Proper buffer configuration
<cdk-virtual-scroll-viewport 
  itemSize="50"
  minBufferPx="400"
  maxBufferPx="800">
```

### 4. Clean Up Resources

```typescript
ngOnDestroy() {
  this.focusTrap?.destroy();
  this.overlayRef?.dispose();
  this.focusMonitor?.stopMonitoring(this.element);
}
```

## Common Use Cases

### Custom Dropdown

```typescript
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  private overlayRef: OverlayRef | null = null;
  
  @HostListener('click')
  toggle() {
    if (this.overlayRef) {
      this.close();
    } else {
      this.open();
    }
  }
  
  private open() {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([...]),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
    
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.backdropClick().subscribe(() => this.close());
    
    const portal = new TemplatePortal(this.content, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }
  
  private close() {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
```

### Infinite Scroll

```typescript
export class InfiniteScrollComponent {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
  ngAfterViewInit() {
    this.viewport.scrolledIndexChange
      .pipe(
        filter(() => this.viewport.measureScrollOffset('bottom') < 200),
        debounceTime(200)
      )
      .subscribe(() => this.loadMore());
  }
  
  loadMore() {
    // Load more items
  }
}
```

## Testing CDK Components

```typescript
describe('CustomDropdown', () => {
  let overlayContainer: OverlayContainer;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [Overlay]
    });
    
    overlayContainer = TestBed.inject(OverlayContainer);
  });
  
  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });
  
  it('should open overlay', () => {
    // Test overlay behavior
  });
});
```

## Resources

- [Angular CDK Documentation](https://material.angular.io/cdk/categories)
- [Accessibility Guide](https://www.w3.org/WAI/ARIA/apg/)
