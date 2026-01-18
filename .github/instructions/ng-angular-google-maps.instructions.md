---
description: 'Angular Google Maps integration for interactive map features with markers, overlays, and event handling'
applyTo: '**/*map*.ts, **/*map*.html, **/*geo*.ts'
---

# Angular Google Maps Development Guidelines

## Core Principles

- Use @angular/google-maps module
- Implement responsive map sizing
- Handle marker clustering for performance
- Optimize API usage and caching
- Follow accessibility guidelines

## Basic Map Implementation

```typescript
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  imports: [GoogleMapsModule],
  template: `
    <google-map [center]="center" [zoom]="zoom" [options]="options">
      <map-marker *ngFor="let marker of markers" [position]="marker.position" />
    </google-map>
  `
})
```

## Best Practices

- ✅ Lazy load Google Maps script
- ✅ Use marker clustering for many markers
- ✅ Cache geocoding results
- ✅ Restrict API keys properly
- ❌ Don't load all markers at once
- ❌ Don't geocode on every keystroke
