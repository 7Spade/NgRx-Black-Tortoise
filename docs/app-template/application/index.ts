/**
 * Application Layer 總匯出
 * 
 * 應用層 (Application Layer) 負責協調領域邏輯和基礎設施，
 * 使用 NgRx Signals 管理狀態，並提供統一的應用服務介面。
 * 
 * 模組結構:
 * 
 * ## Store (狀態管理)
 * - GlobalShell: 全域殼層 Store (Root Level)
 * - WorkspaceList: 工作區列表 Store (Account Level)
 * - Workspace: 工作區上下文 Store (Context Store)
 * - Features: 功能模組 Store (Module Level)
 * - Entities: 實體 Store (Entity Level)
 * 
 * ## Effects (副作用處理)
 * - 使用 rxMethod 處理非同步操作
 * - 同步資料與 Firebase
 * - 處理樂觀更新
 * 
 * ## Commands (命令處理器)
 * - 處理寫入操作
 * - 執行業務邏輯
 * - 發布領域事件
 * 
 * ## Queries (查詢處理器)
 * - 處理讀取操作
 * - 從 Store 或資料源取得資料
 * - 轉換資料格式
 * 
 * ## Services (應用服務)
 * - 協調多個 Store
 * - 提供複雜的業務操作
 * - 封裝跨層邏輯
 * 
 * ## Mappers (資料映射器)
 * - Domain ↔ DTO 轉換
 * - Domain ↔ Firestore 轉換
 * - 資料格式映射
 * 
 * ## Validators (驗證器)
 * - 輸入驗證
 * - 業務規則驗證
 * - 支援 Angular Reactive Forms
 * 
 * ## Guards (路由守衛)
 * - 路由保護
 * - 權限檢查
 * - 重導向處理
 * 
 * ## Interceptors (HTTP 攔截器)
 * - 請求/回應攔截
 * - 全域錯誤處理
 * - 認證和上下文注入
 * 
 * ## Pipes (管道)
 * - 資料轉換
 * - 格式化顯示
 * - 模板使用
 * 
 * ## Directives (指令)
 * - DOM 操作
 * - 行為擴展
 * - 可重用邏輯
 * 
 * ## Models (模型)
 * - Common: 通用模型
 * - DTO: 資料傳輸物件
 * - ViewModels: 視圖模型
 * 
 * ## Utils (工具函數)
 * - Store: Store 輔助工具
 * - Operators: 自訂 RxJS 操作符
 * - Helpers: 通用輔助函數
 * 
 * ## Constants (常數)
 * - API 端點
 * - 路由路徑
 * - Storage Keys
 * - 權限常數
 */

// TODO: Export all application layer modules
