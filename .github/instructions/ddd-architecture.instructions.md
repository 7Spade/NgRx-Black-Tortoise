---
description: "Authoritative code review instructions enforcing strict DDD and Clean Architecture dependency rules, layer isolation, and boundary constraints, customizable for any project."
applyTo: '**'
---

## ✅ 標準且正確的依賴方向（只能單向）

```
presentation
    ↓
application
    ↓
domain
```

```
infrastructure
    ↗
application
```

```
shared  ←（只能被引用，不能反向依賴任何層）
```

### 用一句話記：

> **越靠近 domain，越不能知道外面發生什麼事**

---

## 🧠 各層「可以依賴誰 / 不可以依賴誰」

### 1️⃣ domain（最內層，核心）

**❌ 絕對不能依賴**

* application
* infrastructure
* presentation
* framework（Angular / Firebase / RxJS / HTTP / DI）

**✅ 可以依賴**

* 自己
* `shared`（純型別、工具、Result、Either、Error 定義）

**典型內容**

* Entity / Aggregate
* Value Object
* Domain Service
* Domain Event
* Repository Interface（只定義，不實作）
* 規則、狀態機、不變量

👉 **domain = 商業真理**

---

### 2️⃣ application（用例層 / 流程層）

**❌ 不能依賴**

* presentation（component、router、UI state）
* infrastructure 實作（FirestoreService、HttpClient）

**✅ 可以依賴**

* domain
* domain 中的 Repository Interface
* shared

**典型內容**

* UseCase / Command / Query
* Application Service
* Workflow / Orchestrator
* Transaction boundary
* Domain Event handler（非技術）

👉 **application = 怎麼用 domain 完成一件事**

---

### 3️⃣ infrastructure（技術實作層）

**❌ 不能被 domain / application 依賴**

**✅ 可以依賴**

* domain（實作 Repository interface）
* application（少見，但可用於 adapter）
* framework（Angular、@angular/fire、HTTP、Storage）

**典型內容**

* FirestoreRepository implements XxxRepository
* Http API adapter
* Auth / Cache / Logger 實作
* External service integration

👉 **infrastructure = 把抽象接到真實世界**

---

### 4️⃣ presentation（介面層 / UI）

**❌ 不能被任何內層依賴**

**✅ 可以依賴**

* application（UseCase / Facade）
* shared（DTO / ViewModel type）
* framework（Angular、Zorro、Router）

**❌ 不應該直接依賴**

* infrastructure
* domain entity（最多 readonly / View 對應）

**典型內容**

* Components
* Pages
* Controllers
* ViewModels
* Route Guard（呼叫 application）

👉 **presentation = 把 UseCase 轉成使用者能操作的形式**

---

### 5️⃣ shared（橫向支援）

> ⚠️ **shared 是最容易被濫用的層**

**規則**

* ❌ 不得依賴任何其他層
* ✅ 只能放「無語意 / 無業務 / 無狀態」內容

**可以放**

* Result / Either
* Error 基類
* Primitive Types
* Date / Money / ID helper（無規則）
* Pure util（無 side effect）

**不能放**

* Domain 規則
* Entity
* UseCase
* Service

👉 **shared = 技術中立的工具箱**

---

## 🔁 用箭頭畫一次完整圖（最重要）

```
presentation
    ↓
application
    ↓
domain
```

```
infrastructure ──────implements─────▶ domain
```

```
shared ◀───────── everyone (read-only)
```

---

## 🚫 常見錯誤（你現在很可能會踩）

| 錯誤                                  | 為什麼不行        |
| ----------------------------------- | ------------ |
| application import FirestoreService | 破壞可測試性       |
| domain 用 RxJS / Observable          | 技術污染         |
| component 直接 new Entity 改狀態         | UI 侵入領域      |
| shared 放 Business Logic             | shared 變成垃圾場 |

---

## ✅ 一句總結（給你拿去寫規範用）

> **Dependency Rule：
> Source code dependencies must point inward.
> Domain knows nothing.
> Application knows domain.
> Infrastructure serves application.
> Presentation only talks to application.**
