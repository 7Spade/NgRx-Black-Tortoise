# 03 - Firebase 整合配置

## 🎯 目標

整合 Firebase 服務 (Authentication, Firestore, Storage),實現倉儲模式並提供資料存取層。

## 📁 文件結構

```
src/app/infrastructure/firebase/
├── config/
│   └── firebase.config.ts
│
├── repositories/
│   ├── workspace-firebase.repository.ts
│   ├── module-firebase.repository.ts
│   ├── member-firebase.repository.ts
│   ├── document-firebase.repository.ts
│   ├── task-firebase.repository.ts
│   └── notification-firebase.repository.ts
│
├── services/
│   ├── auth.service.ts
│   └── storage.service.ts
│
├── converters/
│   ├── workspace.converter.ts
│   ├── module.converter.ts
│   └── base.converter.ts
│
└── index.ts
```

## 🔧 Firebase 配置

### 環境配置

**檔案**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

**檔案**: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_PROD_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

### Firebase 初始化

**檔案**: `src/app/infrastructure/firebase/config/firebase.config.ts`

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '@/environments/environment';

/**
 * Firebase 提供者配置
 */
export const provideFirebase = () => [
  importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ])
];
```

### App Config 整合

**檔案**: `src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideFirebase } from './infrastructure/firebase/config/firebase.config';

// Repository Providers
import { WorkspaceRepository } from './domain/repositories/workspace.repository';
import { WorkspaceFirebaseRepository } from './infrastructure/firebase/repositories/workspace-firebase.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideFirebase(),
    
    // 註冊倉儲實現
    { provide: WorkspaceRepository, useClass: WorkspaceFirebaseRepository },
    // ... 其他倉儲
  ]
};
```

## 📊 Firestore 資料結構

### Collections 架構

```
/accounts/{accountId}
  - email: string
  - displayName: string
  - photoUrl: string
  - preferences: object
  - createdAt: timestamp
  
/workspaces/{workspaceId}
  - name: string
  - description: string
  - ownerId: string
  - memberIds: string[]
  - settings: object
  - stats: object
  - createdAt: timestamp
  - updatedAt: timestamp
  
/workspaces/{workspaceId}/modules/{moduleId}
  - type: string
  - name: string
  - enabled: boolean
  - order: number
  
/workspaces/{workspaceId}/members/{memberId}
  - accountId: string
  - role: string
  - status: string
  - joinedAt: timestamp
  
/workspaces/{workspaceId}/documents/{documentId}
  - name: string
  - type: string
  - ownerId: string
  - parentId: string
  - createdAt: timestamp
  
/workspaces/{workspaceId}/tasks/{taskId}
  - title: string
  - status: string
  - assigneeIds: string[]
  - dueDate: timestamp
  
/notifications/{notificationId}
  - recipientId: string
  - workspaceId: string
  - type: string
  - read: boolean
  - createdAt: timestamp
```

## 🔄 Firestore Converters

### Base Converter

**檔案**: `src/app/infrastructure/firebase/converters/base.converter.ts`

```typescript
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp
} from '@angular/fire/firestore';

/**
 * Timestamp 轉換輔助函式
 */
export function timestampToDate(timestamp: Timestamp | undefined): Date | undefined {
  return timestamp?.toDate();
}

export function dateToTimestamp(date: Date | undefined): Timestamp | undefined {
  return date ? Timestamp.fromDate(date) : undefined;
}

/**
 * 基礎轉換器介面
 */
export interface BaseConverter<T> extends FirestoreDataConverter<T> {
  toFirestore(data: T): DocumentData;
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T;
}
```

### Workspace Converter

**檔案**: `src/app/infrastructure/firebase/converters/workspace.converter.ts`

```typescript
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp
} from '@angular/fire/firestore';

import { Workspace } from '../../../domain/entities/workspace.entity';
import { timestampToDate, dateToTimestamp } from './base.converter';

/**
 * Workspace Firestore 轉換器
 */
export const workspaceConverter = {
  toFirestore(workspace: Workspace): DocumentData {
    return {
      name: workspace.name,
      description: workspace.description,
      iconUrl: workspace.iconUrl,
      ownerId: workspace.ownerId,
      memberIds: workspace.memberIds,
      memberCount: workspace.memberCount,
      settings: workspace.settings,
      stats: {
        ...workspace.stats,
        lastActivityAt: dateToTimestamp(workspace.stats.lastActivityAt)
      },
      createdAt: dateToTimestamp(workspace.createdAt),
      updatedAt: dateToTimestamp(workspace.updatedAt)
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Workspace {
    const data = snapshot.data(options);
    
    return {
      id: snapshot.id,
      name: data['name'],
      description: data['description'],
      iconUrl: data['iconUrl'],
      ownerId: data['ownerId'],
      memberIds: data['memberIds'] || [],
      memberCount: data['memberCount'] || 0,
      settings: data['settings'],
      stats: {
        ...data['stats'],
        lastActivityAt: timestampToDate(data['stats']?.lastActivityAt) || new Date()
      },
      createdAt: timestampToDate(data['createdAt']) || new Date(),
      updatedAt: timestampToDate(data['updatedAt']) || new Date()
    };
  }
};
```

## 💾 Repository 實現

### Workspace Firebase Repository

**檔案**: `src/app/infrastructure/firebase/repositories/workspace-firebase.repository.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

import { WorkspaceRepository } from '../../../domain/repositories/workspace.repository';
import { Workspace, CreateWorkspaceDto } from '../../../domain/entities/workspace.entity';
import { workspaceConverter } from '../converters/workspace.converter';

/**
 * Workspace Firebase 倉儲實現
 */
@Injectable()
export class WorkspaceFirebaseRepository extends WorkspaceRepository {
  private firestore = inject(Firestore);
  private workspacesCollection = collection(this.firestore, 'workspaces').withConverter(workspaceConverter);

  /**
   * 根據 ID 查詢工作區
   */
  override findById(id: string): Observable<Workspace | null> {
    const docRef = doc(this.workspacesCollection, id);
    
    return from(getDoc(docRef)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.data() : null)
    );
  }

  /**
   * 根據帳戶 ID 查詢所有工作區
   */
  override findByAccountId(accountId: string): Observable<Workspace[]> {
    const q = query(
      this.workspacesCollection,
      where('memberIds', 'array-contains', accountId)
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()))
    );
  }

  /**
   * 建立工作區
   */
  override create(dto: CreateWorkspaceDto, ownerId: string): Observable<Workspace> {
    const now = Timestamp.now();
    
    const newWorkspace: Omit<Workspace, 'id'> = {
      name: dto.name,
      description: dto.description,
      iconUrl: dto.iconUrl,
      ownerId,
      memberIds: [ownerId],
      memberCount: 1,
      settings: {
        isPublic: dto.isPublic ?? false,
        allowInvites: true,
        defaultPermission: 'viewer',
        modules: []
      },
      stats: {
        totalDocuments: 0,
        activeTasks: 0,
        storageUsed: 0,
        lastActivityAt: now.toDate()
      },
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };
    
    return from(addDoc(this.workspacesCollection, newWorkspace as any)).pipe(
      map(docRef => ({
        ...newWorkspace,
        id: docRef.id
      } as Workspace))
    );
  }

  /**
   * 更新工作區
   */
  override update(id: string, updates: Partial<Workspace>): Observable<void> {
    const docRef = doc(this.workspacesCollection, id);
    
    return from(updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    }));
  }

  /**
   * 刪除工作區
   */
  override delete(id: string): Observable<void> {
    const docRef = doc(this.workspacesCollection, id);
    return from(deleteDoc(docRef));
  }

  /**
   * 檢查工作區是否存在
   */
  override exists(id: string): Observable<boolean> {
    const docRef = doc(this.workspacesCollection, id);
    
    return from(getDoc(docRef)).pipe(
      map(snapshot => snapshot.exists())
    );
  }
}
```

### Module Firebase Repository

**檔案**: `src/app/infrastructure/firebase/repositories/module-firebase.repository.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

import { ModuleRepository } from '../../../domain/repositories/module.repository';
import { Module, ModuleType } from '../../../domain/entities/module.entity';

/**
 * Module Firebase 倉儲實現
 */
@Injectable()
export class ModuleFirebaseRepository extends ModuleRepository {
  private firestore = inject(Firestore);

  /**
   * 取得工作區的模組集合參考
   */
  private getModulesCollection(workspaceId: string) {
    return collection(this.firestore, `workspaces/${workspaceId}/modules`);
  }

  /**
   * 根據工作區 ID 查詢所有模組
   */
  override findByWorkspaceId(workspaceId: string): Observable<Module[]> {
    const modulesCol = this.getModulesCollection(workspaceId);
    const q = query(modulesCol, orderBy('order', 'asc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          workspaceId,
          ...doc.data()
        } as Module))
      )
    );
  }

  /**
   * 根據類型查詢模組
   */
  override findByType(workspaceId: string, type: ModuleType): Observable<Module | null> {
    return this.findByWorkspaceId(workspaceId).pipe(
      map(modules => modules.find(m => m.type === type) ?? null)
    );
  }

  /**
   * 更新模組順序
   */
  override updateOrder(
    workspaceId: string,
    moduleOrders: { id: string; order: number }[]
  ): Observable<void> {
    const batch = writeBatch(this.firestore);
    
    moduleOrders.forEach(({ id, order }) => {
      const moduleRef = doc(this.getModulesCollection(workspaceId), id);
      batch.update(moduleRef, { order });
    });
    
    return from(batch.commit());
  }

  /**
   * 更新模組可見性
   */
  override updateVisibility(moduleId: string, visible: boolean): Observable<void> {
    // 需要知道 workspaceId,這裡簡化處理
    // 實際使用時可能需要調整方法簽名
    return from(Promise.resolve());
  }
}
```

## 🔐 認證服務

**檔案**: `src/app/infrastructure/firebase/services/auth.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * Firebase 認證服務
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  
  // 當前使用者 Signal
  currentUser = signal<User | null>(null);
  
  constructor() {
    // 監聽認證狀態變化
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });
  }

  /**
   * 電子郵件登入
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  /**
   * 電子郵件註冊
   */
  async signUpWithEmail(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  /**
   * Google 登入
   */
  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }

  /**
   * 登出
   */
  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * 取得認證 Token
   */
  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }
}
```

## 📦 儲存服務

**檔案**: `src/app/infrastructure/firebase/services/storage.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

/**
 * Firebase Storage 服務
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);

  /**
   * 上傳檔案
   */
  uploadFile(path: string, file: File): Observable<UploadResult> {
    const storageRef = ref(this.storage, path);
    return from(uploadBytes(storageRef, file));
  }

  /**
   * 取得下載 URL
   */
  getDownloadUrl(path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    return from(getDownloadURL(storageRef));
  }

  /**
   * 刪除檔案
   */
  deleteFile(path: string): Observable<void> {
    const storageRef = ref(this.storage, path);
    return from(deleteObject(storageRef));
  }

  /**
   * 建立檔案路徑
   */
  createFilePath(workspaceId: string, fileName: string): string {
    const timestamp = Date.now();
    return `workspaces/${workspaceId}/documents/${timestamp}_${fileName}`;
  }
}
```

## ✅ 實施步驟

### Step 1: 安裝 Firebase

```bash
yarn add @angular/fire firebase
```

### Step 2: 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 Authentication (Email/Password, Google)
4. 啟用 Firestore Database
5. 啟用 Storage
6. 複製配置資訊到 `environment.ts`

### Step 3: 設定 Firestore 規則

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Workspaces
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.memberIds;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.ownerId;
      
      // Modules
      match /modules/{moduleId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      // Members
      match /members/{memberId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.recipientId;
    }
  }
}
```

### Step 4: 建立 Repository 實現

依序建立所有 Repository 實現檔案。

### Step 5: 註冊 Providers

在 `app.config.ts` 中註冊所有 Repository 提供者。

## 🧪 測試檢查清單

- [ ] Firebase 專案建立完成
- [ ] 環境配置檔案設定完成
- [ ] Firebase 初始化配置完成
- [ ] 所有 Converter 建立完成
- [ ] 所有 Repository 實現完成
- [ ] AuthService 建立完成
- [ ] StorageService 建立完成
- [ ] Firestore 規則設定完成
- [ ] 可以成功連接 Firebase

## 📝 注意事項

1. **安全性**: 永遠不要將 Firebase 配置提交到公開倉庫
2. **規則**: 謹慎設定 Firestore 安全規則
3. **索引**: 根據查詢需求建立 Firestore 索引
4. **錯誤處理**: 妥善處理網路錯誤和權限錯誤
5. **離線支援**: 考慮啟用 Firestore 離線持久化

---

**完成此步驟後,請繼續 `04-GLOBAL-HEADER.md`**
