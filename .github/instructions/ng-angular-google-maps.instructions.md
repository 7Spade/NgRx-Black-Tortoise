---
description: 'Configuration for AI behavior when implementing Google Maps integration with markers, clustering, and geocoding'
applyTo: '**'
---

# Angular Google Maps Rules
Configuration for AI behavior when implementing Google Maps features

## CRITICAL: Lazy load Google Maps script
- YOU MUST lazy load Google Maps API script to optimize initial page load
- Use `@angular/google-maps` module (official Angular integration)
- Configure API key in environment:
  ```typescript
  // Do NOT hardcode API key in code
  environment.googleMapsApiKey = 'YOUR_API_KEY';
  ```
- Load script only when map component is needed
- > NOTE: Google Maps API has usage quotas and costs

## When implementing map with many markers
- MUST use marker clustering for performance when displaying >50 markers
- Configure cluster options:
  - `minimumClusterSize`: minimum markers before clustering
  - `maxZoom`: maximum zoom level for clusters
  - Custom cluster icons for better UX
- Load markers in viewport only (lazy loading pattern)
- Paginate or virtualize marker data from backend

## When implementing geocoding
- MUST cache geocoding results to avoid repeated API calls:
  - Store address → coordinates mappings
  - Use browser storage for persistence
- Debounce geocoding requests (wait 300-500ms after typing)
- MUST NOT geocode on every keystroke
- Handle geocoding errors gracefully
- EXAMPLE:
  - After: User types in address search
  - Do: Debounce input, check cache, then geocode if needed
  - Before: Displaying results

## CRITICAL: API key security
- MUST restrict API keys in Google Cloud Console:
  - HTTP referrers restriction (specific domains only)
  - API restrictions (Maps JavaScript API only)
  - Monitor usage and set quotas
- MUST NOT commit API keys to version control
- Use environment variables for configuration

## When implementing responsive map sizing
- Set explicit height for map container:
  ```css
  google-map {
    height: 400px;
    width: 100%;
  }
  ```
- Use responsive breakpoints for mobile:
  - Smaller height on mobile
  - Different zoom levels per device
- Handle resize events properly

## General
- Lazy load Google Maps script
- Use `@angular/google-maps` module
- Implement marker clustering for performance
- Cache geocoding results
- Debounce geocoding requests
- Restrict and secure API keys
- Implement responsive map sizing
- Handle loading and error states
- Follow accessibility guidelines (keyboard navigation, screen reader support)
