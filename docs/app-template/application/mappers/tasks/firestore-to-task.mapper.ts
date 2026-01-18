/**
 * ============================================================
 * 檔案名稱： firestore-to-task.mapper.ts
 * 功能說明： 將 Firestore 資料轉換為 Task 領域模型，支援 application/mappers/tasks 相關流程。
 * 所屬模組： application/mappers/tasks
 * ============================================================
 *
 * 【業務背景 / 使用情境】
 * - 用於協調領域與基礎設施的用例流程。
 * - 使用者：UI 元件/路由/功能模組。
 * - 解決問題：集中狀態管理與流程編排。
 *
 * 【核心職責（這個檔案「只」做什麼）】
 * ✔ 負責：
 * - 將 Firestore 文件映射為 Task 物件。
 * - 處理欄位對應與型別正規化。
 *
 * ✘ 不負責：
 * - 不包含核心商業規則（由 Domain 負責）。
 * - 不直接處理 UI 呈現。
 *
 * 【設計假設】
 * - 依賴 domain 模型與介面契約。
 * - 透過 DI 取得 infrastructure 實作。
 *
 * 【限制與風險】
 * - 狀態不同步可能導致流程錯誤。
 * - 過度耦合會影響層次分離。
 *
 * 【資料流 / 流程簡述】
 * 1. UI 觸發 store/handler。
 * 2. 應用層呼叫 domain/infrastructure。
 * 3. 更新 state 並回傳結果。
 *
 * 【相依關係】
 * - 依賴：
 *   - domain 模型/事件/介面。
 *   - infrastructure services/repositories。
 *
 * - 被使用於：
 *   - presentation components/pages。
 *   - route guards/interceptors。
 *
 * 【錯誤處理策略】
 * - 預期錯誤：
 *   - 驗證或權限不足。
 *   - 外部 I/O 失敗。
 * - 非預期錯誤：
 *   - 不可預期例外。
 *
 * 【未來擴充 / TODO】
 * - ⏳ 補齊流程測試與效能指標。
 * - ⏳ 補齊錯誤追蹤與回報策略。
 */
