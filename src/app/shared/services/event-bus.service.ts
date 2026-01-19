/**
 * EventBus Service - Shared Layer
 * 
 * Provides cross-store communication without direct dependencies.
 * Follows reactive patterns with RxJS subjects.
 * 
 * Domain-agnostic event bus for architectural decoupling.
 */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventSubject = new Subject<AppEvent>();

  /**
   * Emit an event to all listeners
   */
  emit<T = any>(event: Omit<AppEvent<T>, 'timestamp'>): void {
    this.eventSubject.next({
      ...event,
      timestamp: Date.now(),
    });
  }

  /**
   * Listen to events of a specific type
   */
  on<T = any>(eventType: string): Observable<AppEvent<T>> {
    return this.eventSubject.asObservable().pipe(
      filter((event) => event.type === eventType),
      map((event) => event as AppEvent<T>)
    );
  }

  /**
   * Listen to all events
   */
  events(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }
}
