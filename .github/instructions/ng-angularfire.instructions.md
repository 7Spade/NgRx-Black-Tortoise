---
description: 'AngularFire integration best practices for Firebase services (Auth, Firestore, Storage, Functions) in Angular 20+ applications with standalone components'
applyTo: '**/*.ts, **/environment*.ts'
---

# AngularFire Integration Guidelines

## Overview

AngularFire is the official Angular library for Firebase. This guide covers best practices for integrating Firebase services (Authentication, Firestore, Storage, Functions, Analytics) with Angular 20+ standalone applications.

## Setup and Configuration

### Installation

```bash
pnpm install @angular/fire firebase
```

### Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    measurementId: "G-XXXXXXXXXX"
  }
};

// ⚠️ NEVER commit actual credentials to version control
// Use environment variables or secrets management
```

### App Configuration (Standalone)

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
  ]
};
```

## Authentication

### Auth Service Pattern

```typescript
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
         signOut, user, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export class AuthService {
  private auth = inject(Auth);
  
  // Convert user observable to signal
  user = toSignal(user(this.auth), { initialValue: null });
  
  async signIn(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential.user;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  async signUp(email: string, password: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      return credential.user;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  async signOut() {
    await signOut(this.auth);
  }
  
  private handleAuthError(error: any) {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/user-not-found':
        throw new Error('User not found');
      case 'auth/wrong-password':
        throw new Error('Invalid password');
      case 'auth/email-already-in-use':
        throw new Error('Email already in use');
      case 'auth/weak-password':
        throw new Error('Password is too weak');
      default:
        throw new Error('Authentication failed');
    }
  }
}
```

### Auth Guard

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  return user(auth).pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
```

## Firestore

### Firestore Service Pattern

```typescript
import { Firestore, collection, collectionData, doc, docData,
         addDoc, setDoc, updateDoc, deleteDoc, query, where,
         orderBy, limit, QueryConstraint } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export class TasksFirestoreService {
  private firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');
  
  // Get all tasks as observable
  getTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }
  
  // Get tasks with query
  getUserTasks(userId: string, filters?: {
    status?: 'completed' | 'active';
    limit?: number;
  }): Observable<Task[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId)
    ];
    
    if (filters?.status) {
      constraints.push(
        where('completed', '==', filters.status === 'completed')
      );
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (filters?.limit) {
      constraints.push(limit(filters.limit));
    }
    
    const userTasksQuery = query(this.tasksCollection, ...constraints);
    return collectionData(userTasksQuery, { idField: 'id' }) as Observable<Task[]>;
  }
  
  // Get single task
  getTask(id: string): Observable<Task> {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return docData(taskDoc, { idField: 'id' }) as Observable<Task>;
  }
  
  // Add new task
  async addTask(task: Omit<Task, 'id'>) {
    return await addDoc(this.tasksCollection, {
      ...task,
      createdAt: new Date()
    });
  }
  
  // Update task
  async updateTask(id: string, data: Partial<Task>) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    await updateDoc(taskDoc, data);
  }
  
  // Delete task
  async deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    await deleteDoc(taskDoc);
  }
}
```

### Integration with NgRx Signals

```typescript
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null
  }),
  withMethods((store, firestoreService = inject(TasksFirestoreService)) => ({
    loadTasks: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => firestoreService.getUserTasks(userId)),
        tapResponse({
          next: (tasks) => patchState(store, { tasks, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    async addTask(task: Omit<Task, 'id'>) {
      try {
        await firestoreService.addTask(task);
      } catch (error: any) {
        patchState(store, { error: error.message });
      }
    }
  }))
);
```

## Cloud Storage

### Storage Service Pattern

```typescript
import { Storage, ref, uploadBytes, uploadBytesResumable,
         getDownloadURL, deleteObject, listAll } from '@angular/fire/storage';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export class StorageService {
  private storage = inject(Storage);
  
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
  
  uploadFileWithProgress(file: File, path: string): Observable<number> {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Observable<number>(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => observer.error(error),
        async () => {
          observer.complete();
        }
      );
    });
  }
  
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }
  
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return await getDownloadURL(storageRef);
  }
}
```

## Cloud Functions

### Functions Service Pattern

```typescript
import { Functions, httpsCallable } from '@angular/fire/functions';
import { inject } from '@angular/core';

export class FunctionsService {
  private functions = inject(Functions);
  
  async sendEmail(data: { to: string; subject: string; body: string }) {
    const sendEmailFn = httpsCallable(this.functions, 'sendEmail');
    const result = await sendEmailFn(data);
    return result.data;
  }
  
  async processPayment(paymentData: any) {
    const processPaymentFn = httpsCallable(
      this.functions,
      'processPayment',
      { timeout: 60000 }
    );
    
    try {
      const result = await processPaymentFn(paymentData);
      return result.data;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
}
```

## Best Practices

### 1. Use Dependency Injection

```typescript
// ✅ Good - Use inject()
export class MyService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private storage = inject(Storage);
}

// ❌ Bad - Don't import Firebase directly
import { getFirestore } from 'firebase/firestore';
const firestore = getFirestore();
```

### 2. Convert Observables to Signals

```typescript
// ✅ Good - Use toSignal
import { toSignal } from '@angular/core/rxjs-interop';

export class Component {
  private auth = inject(Auth);
  user = toSignal(user(this.auth), { initialValue: null });
  
  private tasksService = inject(TasksService);
  tasks = toSignal(this.tasksService.getTasks(), { initialValue: [] });
}
```

### 3. Handle Errors Properly

```typescript
// ✅ Good - Specific error handling
async signIn(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(this.auth, email, password);
  } catch (error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('User not found');
      case 'auth/wrong-password':
        throw new Error('Invalid password');
      default:
        throw new Error('Authentication failed');
    }
  }
}
```

### 4. Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks belong to users
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}

// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Enable Offline Persistence

```typescript
import { enableIndexedDbPersistence } from '@angular/fire/firestore';

provideFirebaseApp(() => {
  const app = initializeApp(environment.firebase);
  const firestore = getFirestore(app);
  enableIndexedDbPersistence(firestore).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence');
    }
  });
  return app;
});
```

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

describe('TasksFirestoreService', () => {
  let service: TasksFirestoreService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        TasksFirestoreService
      ]
    });
    service = TestBed.inject(TasksFirestoreService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## Common Pitfalls

### 1. Missing Firebase Initialization

```typescript
// ❌ Bad - No Firebase initialization
// Will cause errors

// ✅ Good - Proper initialization in app.config.ts
providers: [
  provideFirebaseApp(() => initializeApp(environment.firebase))
]
```

### 2. Not Handling Auth State

```typescript
// ❌ Bad - Assuming user is always logged in
const userId = this.auth.currentUser!.uid;

// ✅ Good - Check auth state
const currentUser = this.auth.currentUser;
if (currentUser) {
  const userId = currentUser.uid;
} else {
  // Handle unauthenticated state
}
```

### 3. Ignoring Security Rules

```typescript
// ❌ Bad - Open access to all data
allow read, write: if true;

// ✅ Good - Proper access control
allow read, write: if request.auth != null && 
                      request.auth.uid == resource.data.userId;
```

## Resources

- [AngularFire Documentation](https://github.com/angular/angularfire)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
