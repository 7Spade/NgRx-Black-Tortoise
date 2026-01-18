# Presentation Layer 檔案樹結構 (Material Design 3 版本)

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

按照開發順序,最後一層是 **Presentation Layer (呈現層)**,負責所有 UI 相關的邏輯。

根據您的架構和 **Angular 20 + Angular Material 20 (Material Design 3) + CDK** 技術棧,以下是 `src/app/presentation` 的完整檔案樹:

```
src/app/presentation/
│
├── layouts/                                   # 布局組件
│   │
│   ├── shell/                                # Shell Layout (主框架)
│   │   ├── shell-layout.component.ts        # Shell 布局組件
│   │   ├── shell-layout.component.html      # Shell 布局模板
│   │   ├── shell-layout.component.scss      # Shell 布局樣式
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace Layout
│   │   ├── workspace-layout.component.ts    # Workspace 布局組件
│   │   ├── workspace-layout.component.html  # Workspace 布局模板
│   │   ├── workspace-layout.component.scss  # Workspace 布局樣式
│   │   └── index.ts
│   │
│   ├── auth/                                 # Auth Layout (登入註冊頁面)
│   │   ├── auth-layout.component.ts         # Auth 布局組件
│   │   ├── auth-layout.component.html       # Auth 布局模板
│   │   ├── auth-layout.component.scss       # Auth 布局樣式
│   │   └── index.ts
│   │
│   ├── blank/                                # Blank Layout (空白頁面)
│   │   ├── blank-layout.component.ts        # Blank 布局組件
│   │   ├── blank-layout.component.html      # Blank 布局模板
│   │   ├── blank-layout.component.scss      # Blank 布局樣式
│   │   └── index.ts
│   │
│   └── index.ts                              # Layouts 總匯出
│
├── features/                                  # Feature Modules (功能模組)
│   │
│   ├── auth/                                 # Auth Feature (認證功能)
│   │   ├── pages/                           # Auth Pages
│   │   │   ├── login/                       # Login Page
│   │   │   │   ├── login-page.component.ts
│   │   │   │   ├── login-page.component.html
│   │   │   │   ├── login-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── register/                    # Register Page
│   │   │   │   ├── register-page.component.ts
│   │   │   │   ├── register-page.component.html
│   │   │   │   ├── register-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── forgot-password/            # Forgot Password Page
│   │   │   │   ├── forgot-password-page.component.ts
│   │   │   │   ├── forgot-password-page.component.html
│   │   │   │   ├── forgot-password-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Auth Components
│   │   │   ├── login-form/                 # Login Form Component
│   │   │   │   ├── login-form.component.ts
│   │   │   │   ├── login-form.component.html
│   │   │   │   ├── login-form.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── register-form/              # Register Form Component
│   │   │   │   ├── register-form.component.ts
│   │   │   │   ├── register-form.component.html
│   │   │   │   ├── register-form.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── social-login/               # Social Login Component
│   │   │   │   ├── social-login.component.ts
│   │   │   │   ├── social-login.component.html
│   │   │   │   ├── social-login.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── auth.routes.ts                   # Auth 路由配置
│   │   └── index.ts
│   │
│   ├── workspace-list/                       # WorkspaceList Feature (工作區列表)
│   │   ├── pages/                           # WorkspaceList Pages
│   │   │   ├── workspace-list-page/        # Workspace List Page
│   │   │   │   ├── workspace-list-page.component.ts
│   │   │   │   ├── workspace-list-page.component.html
│   │   │   │   ├── workspace-list-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-create-page/      # Workspace Create Page
│   │   │   │   ├── workspace-create-page.component.ts
│   │   │   │   ├── workspace-create-page.component.html
│   │   │   │   ├── workspace-create-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # WorkspaceList Components
│   │   │   ├── workspace-card/             # Workspace Card Component
│   │   │   │   ├── workspace-card.component.ts
│   │   │   │   ├── workspace-card.component.html
│   │   │   │   ├── workspace-card.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-grid/             # Workspace Grid Component
│   │   │   │   ├── workspace-grid.component.ts
│   │   │   │   ├── workspace-grid.component.html
│   │   │   │   ├── workspace-grid.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-create-dialog/    # Workspace Create Dialog
│   │   │   │   ├── workspace-create-dialog.component.ts
│   │   │   │   ├── workspace-create-dialog.component.html
│   │   │   │   ├── workspace-create-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── workspace-list.routes.ts         # WorkspaceList 路由配置
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace Feature (工作區)
│   │   ├── pages/                           # Workspace Pages
│   │   │   ├── workspace-home-page/        # Workspace Home Page
│   │   │   │   ├── workspace-home-page.component.ts
│   │   │   │   ├── workspace-home-page.component.html
│   │   │   │   ├── workspace-home-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Workspace Components
│   │   │   ├── workspace-header/           # Workspace Header
│   │   │   │   ├── workspace-header.component.ts
│   │   │   │   ├── workspace-header.component.html
│   │   │   │   ├── workspace-header.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-sidenav/          # Workspace Sidenav (Material Sidenav)
│   │   │   │   ├── workspace-sidenav.component.ts
│   │   │   │   ├── workspace-sidenav.component.html
│   │   │   │   ├── workspace-sidenav.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-switcher/         # Workspace Switcher
│   │   │   │   ├── workspace-switcher.component.ts
│   │   │   │   ├── workspace-switcher.component.html
│   │   │   │   ├── workspace-switcher.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── workspace.routes.ts              # Workspace 路由配置
│   │   └── index.ts
│   │
│   ├── overview/                             # Overview Module (概覽模組)
│   │   ├── pages/                           # Overview Pages
│   │   │   ├── overview-page/              # Overview Page
│   │   │   │   ├── overview-page.component.ts
│   │   │   │   ├── overview-page.component.html
│   │   │   │   ├── overview-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Overview Components
│   │   │   ├── dashboard-widget/           # Dashboard Widget
│   │   │   │   ├── dashboard-widget.component.ts
│   │   │   │   ├── dashboard-widget.component.html
│   │   │   │   ├── dashboard-widget.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── activity-timeline/          # Activity Timeline
│   │   │   │   ├── activity-timeline.component.ts
│   │   │   │   ├── activity-timeline.component.html
│   │   │   │   ├── activity-timeline.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workspace-stats/            # Workspace Stats
│   │   │   │   ├── workspace-stats.component.ts
│   │   │   │   ├── workspace-stats.component.html
│   │   │   │   ├── workspace-stats.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── overview.routes.ts               # Overview 路由配置
│   │   └── index.ts
│   │
│   ├── tasks/                                # Tasks Module (任務模組)
│   │   ├── pages/                           # Tasks Pages
│   │   │   ├── task-list-page/             # Task List Page
│   │   │   │   ├── task-list-page.component.ts
│   │   │   │   ├── task-list-page.component.html
│   │   │   │   ├── task-list-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-detail-page/           # Task Detail Page
│   │   │   │   ├── task-detail-page.component.ts
│   │   │   │   ├── task-detail-page.component.html
│   │   │   │   ├── task-detail-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-board-page/            # Task Board Page (Kanban with CDK Drag-Drop)
│   │   │   │   ├── task-board-page.component.ts
│   │   │   │   ├── task-board-page.component.html
│   │   │   │   ├── task-board-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Tasks Components
│   │   │   ├── task-list/                  # Task List Component
│   │   │   │   ├── task-list.component.ts
│   │   │   │   ├── task-list.component.html
│   │   │   │   ├── task-list.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-item/                  # Task Item Component
│   │   │   │   ├── task-item.component.ts
│   │   │   │   ├── task-item.component.html
│   │   │   │   ├── task-item.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-create-dialog/         # Task Create Dialog (MatDialog)
│   │   │   │   ├── task-create-dialog.component.ts
│   │   │   │   ├── task-create-dialog.component.html
│   │   │   │   ├── task-create-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-edit-dialog/           # Task Edit Dialog (MatDialog)
│   │   │   │   ├── task-edit-dialog.component.ts
│   │   │   │   ├── task-edit-dialog.component.html
│   │   │   │   ├── task-edit-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-filter-bar/            # Task Filter Bar
│   │   │   │   ├── task-filter-bar.component.ts
│   │   │   │   ├── task-filter-bar.component.html
│   │   │   │   ├── task-filter-bar.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-kanban-board/          # Task Kanban Board (CDK Drag-Drop)
│   │   │   │   ├── task-kanban-board.component.ts
│   │   │   │   ├── task-kanban-board.component.html
│   │   │   │   ├── task-kanban-board.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-kanban-column/         # Task Kanban Column (CDK Drag-Drop)
│   │   │   │   ├── task-kanban-column.component.ts
│   │   │   │   ├── task-kanban-column.component.html
│   │   │   │   ├── task-kanban-column.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-detail-panel/          # Task Detail Panel (MatExpansionPanel)
│   │   │   │   ├── task-detail-panel.component.ts
│   │   │   │   ├── task-detail-panel.component.html
│   │   │   │   ├── task-detail-panel.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── task-comment-list/          # Task Comment List
│   │   │   │   ├── task-comment-list.component.ts
│   │   │   │   ├── task-comment-list.component.html
│   │   │   │   ├── task-comment-list.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── tasks.routes.ts                  # Tasks 路由配置
│   │   └── index.ts
│   │
│   ├── documents/                            # Documents Module (文件模組)
│   │   ├── pages/                           # Documents Pages
│   │   │   ├── document-list-page/         # Document List Page
│   │   │   │   ├── document-list-page.component.ts
│   │   │   │   ├── document-list-page.component.html
│   │   │   │   ├── document-list-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── document-detail-page/       # Document Detail Page
│   │   │   │   ├── document-detail-page.component.ts
│   │   │   │   ├── document-detail-page.component.html
│   │   │   │   ├── document-detail-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Documents Components
│   │   │   ├── document-tree/              # Document Tree Component (CDK Tree)
│   │   │   │   ├── document-tree.component.ts
│   │   │   │   ├── document-tree.component.html
│   │   │   │   ├── document-tree.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── document-grid/              # Document Grid Component
│   │   │   │   ├── document-grid.component.ts
│   │   │   │   ├── document-grid.component.html
│   │   │   │   ├── document-grid.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── document-card/              # Document Card Component
│   │   │   │   ├── document-card.component.ts
│   │   │   │   ├── document-card.component.html
│   │   │   │   ├── document-card.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── document-upload-dialog/     # Document Upload Dialog (MatDialog)
│   │   │   │   ├── document-upload-dialog.component.ts
│   │   │   │   ├── document-upload-dialog.component.html
│   │   │   │   ├── document-upload-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── document-viewer/            # Document Viewer
│   │   │   │   ├── document-viewer.component.ts
│   │   │   │   ├── document-viewer.component.html
│   │   │   │   ├── document-viewer.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── folder-create-dialog/       # Folder Create Dialog (MatDialog)
│   │   │   │   ├── folder-create-dialog.component.ts
│   │   │   │   ├── folder-create-dialog.component.html
│   │   │   │   ├── folder-create-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── documents.routes.ts              # Documents 路由配置
│   │   └── index.ts
│   │
│   ├── members/                              # Members Module (成員模組)
│   │   ├── pages/                           # Members Pages
│   │   │   ├── member-list-page/           # Member List Page
│   │   │   │   ├── member-list-page.component.ts
│   │   │   │   ├── member-list-page.component.html
│   │   │   │   ├── member-list-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Members Components
│   │   │   ├── member-list/                # Member List Component (MatTable)
│   │   │   │   ├── member-list.component.ts
│   │   │   │   ├── member-list.component.html
│   │   │   │   ├── member-list.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── member-card/                # Member Card Component
│   │   │   │   ├── member-card.component.ts
│   │   │   │   ├── member-card.component.html
│   │   │   │   ├── member-card.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── member-invite-dialog/       # Member Invite Dialog (MatDialog)
│   │   │   │   ├── member-invite-dialog.component.ts
│   │   │   │   ├── member-invite-dialog.component.html
│   │   │   │   ├── member-invite-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── member-role-editor/         # Member Role Editor
│   │   │   │   ├── member-role-editor.component.ts
│   │   │   │   ├── member-role-editor.component.html
│   │   │   │   ├── member-role-editor.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── members.routes.ts                # Members 路由配置
│   │   └── index.ts
│   │
│   ├── permissions/                          # Permissions Module (權限模組)
│   │   ├── pages/                           # Permissions Pages
│   │   │   ├── permission-list-page/       # Permission List Page
│   │   │   │   ├── permission-list-page.component.ts
│   │   │   │   ├── permission-list-page.component.html
│   │   │   │   ├── permission-list-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Permissions Components
│   │   │   ├── permission-matrix/          # Permission Matrix (MatTable)
│   │   │   │   ├── permission-matrix.component.ts
│   │   │   │   ├── permission-matrix.component.html
│   │   │   │   ├── permission-matrix.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── role-editor/                # Role Editor
│   │   │   │   ├── role-editor.component.ts
│   │   │   │   ├── role-editor.component.html
│   │   │   │   ├── role-editor.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── permissions.routes.ts            # Permissions 路由配置
│   │   └── index.ts
│   │
│   ├── audit/                                # Audit Module (審計模組)
│   │   ├── pages/                           # Audit Pages
│   │   │   ├── audit-log-page/             # Audit Log Page
│   │   │   │   ├── audit-log-page.component.ts
│   │   │   │   ├── audit-log-page.component.html
│   │   │   │   ├── audit-log-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Audit Components
│   │   │   ├── audit-log-list/             # Audit Log List (MatTable + Virtual Scroll)
│   │   │   │   ├── audit-log-list.component.ts
│   │   │   │   ├── audit-log-list.component.html
│   │   │   │   ├── audit-log-list.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── audit-log-detail/           # Audit Log Detail
│   │   │   │   ├── audit-log-detail.component.ts
│   │   │   │   ├── audit-log-detail.component.html
│   │   │   │   ├── audit-log-detail.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── audit.routes.ts                  # Audit 路由配置
│   │   └── index.ts
│   │
│   ├── settings/                             # Settings Module (設定模組)
│   │   ├── pages/                           # Settings Pages
│   │   │   ├── workspace-settings-page/    # Workspace Settings Page
│   │   │   │   ├── workspace-settings-page.component.ts
│   │   │   │   ├── workspace-settings-page.component.html
│   │   │   │   ├── workspace-settings-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Settings Components
│   │   │   ├── general-settings/           # General Settings (MatCard)
│   │   │   │   ├── general-settings.component.ts
│   │   │   │   ├── general-settings.component.html
│   │   │   │   ├── general-settings.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── integration-settings/       # Integration Settings (MatCard)
│   │   │   │   ├── integration-settings.component.ts
│   │   │   │   ├── integration-settings.component.html
│   │   │   │   ├── integration-settings.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── settings.routes.ts               # Settings 路由配置
│   │   └── index.ts
│   │
│   ├── journal/                              # Journal Module (日誌模組)
│   │   ├── pages/                           # Journal Pages
│   │   │   ├── journal-page/               # Journal Page
│   │   │   │   ├── journal-page.component.ts
│   │   │   │   ├── journal-page.component.html
│   │   │   │   ├── journal-page.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── components/                      # Journal Components
│   │   │   ├── activity-feed/              # Activity Feed (CDK Virtual Scroll)
│   │   │   │   ├── activity-feed.component.ts
│   │   │   │   ├── activity-feed.component.html
│   │   │   │   ├── activity-feed.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── activity-item/              # Activity Item
│   │   │   │   ├── activity-item.component.ts
│   │   │   │   ├── activity-item.component.html
│   │   │   │   ├── activity-item.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── journal.routes.ts                # Journal 路由配置
│   │   └── index.ts
│   │
│   └── index.ts                              # Features 總匯出
│
├── shared/                                    # Shared Components (共享組件)
│   │
│   ├── components/                           # Shared Components
│   │   │
│   │   ├── ui/                              # UI Components (基礎 UI 元件)
│   │   │   ├── button/                     # Custom Button (基於 MatButton)
│   │   │   │   ├── button.component.ts
│   │   │   │   ├── button.component.html
│   │   │   │   ├── button.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── avatar/                     # Custom Avatar
│   │   │   │   ├── avatar.component.ts
│   │   │   │   ├── avatar.component.html
│   │   │   │   ├── avatar.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── chip/                       # Custom Chip (基於 MatChip)
│   │   │   │   ├── chip.component.ts
│   │   │   │   ├── chip.component.html
│   │   │   │   ├── chip.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── status-chip/                # Status Chip (MatChip)
│   │   │   │   ├── status-chip.component.ts
│   │   │   │   ├── status-chip.component.html
│   │   │   │   ├── status-chip.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── loading-spinner/            # Loading Spinner (MatProgressSpinner)
│   │   │   │   ├── loading-spinner.component.ts
│   │   │   │   ├── loading-spinner.component.html
│   │   │   │   ├── loading-spinner.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── empty-state/                # Empty State
│   │   │   │   ├── empty-state.component.ts
│   │   │   │   ├── empty-state.component.html
│   │   │   │   ├── empty-state.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── error-state/                # Error State
│   │   │   │   ├── error-state.component.ts
│   │   │   │   ├── error-state.component.html
│   │   │   │   ├── error-state.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── form/                            # Form Components (表單元件)
│   │   │   ├── form-field/                 # Form Field Wrapper (MatFormField)
│   │   │   │   ├── form-field.component.ts
│   │   │   │   ├── form-field.component.html
│   │   │   │   ├── form-field.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── rich-text-editor/           # Rich Text Editor (基於第三方或自定義)
│   │   │   │   ├── rich-text-editor.component.ts
│   │   │   │   ├── rich-text-editor.component.html
│   │   │   │   ├── rich-text-editor.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── date-range-picker/          # Date Range Picker (MatDatepicker)
│   │   │   │   ├── date-range-picker.component.ts
│   │   │   │   ├── date-range-picker.component.html
│   │   │   │   ├── date-range-picker.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── file-uploader/              # File Uploader (CDK)
│   │   │   │   ├── file-uploader.component.ts
│   │   │   │   ├── file-uploader.component.html
│   │   │   │   ├── file-uploader.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── data-display/                    # Data Display Components (資料展示元件)
│   │   │   ├── data-table/                 # Data Table (基於 MatTable + CDK)
│   │   │   │   ├── data-table.component.ts
│   │   │   │   ├── data-table.component.html
│   │   │   │   ├── data-table.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── pagination/                 # Pagination (MatPaginator)
│   │   │   │   ├── pagination.component.ts
│   │   │   │   ├── pagination.component.html
│   │   │   │   ├── pagination.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── stat-card/                  # Stat Card (MatCard)
│   │   │   │   ├── stat-card.component.ts
│   │   │   │   ├── stat-card.component.html
│   │   │   │   ├── stat-card.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/                      # Navigation Components (導航元件)
│   │   │   ├── breadcrumb/                 # Breadcrumb
│   │   │   │   ├── breadcrumb.component.ts
│   │   │   │   ├── breadcrumb.component.html
│   │   │   │   ├── breadcrumb.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── tabs/                       # Tabs (MatTabGroup)
│   │   │   │   ├── tabs.component.ts
│   │   │   │   ├── tabs.component.html
│   │   │   │   ├── tabs.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── feedback/                        # Feedback Components (回饋元件)
│   │   │   ├── snackbar/                   # Snackbar Notification (MatSnackBar)
│   │   │   │   ├── snackbar.component.ts
│   │   │   │   ├── snackbar.component.html
│   │   │   │   ├── snackbar.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── confirm-dialog/             # Confirm Dialog (MatDialog)
│   │   │   │   ├── confirm-dialog.component.ts
│   │   │   │   ├── confirm-dialog.component.html
│   │   │   │   ├── confirm-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── directives/                           # Shared Directives
│   │   ├── has-permission.directive.ts      # Permission Check Directive
│   │   ├── workspace-scoped.directive.ts    # Workspace Scope Directive
│   │   ├── auto-focus.directive.ts          # Auto Focus Directive
│   │   ├── click-outside.directive.ts       # Click Outside Directive (CDK)
│   │   ├── lazy-load.directive.ts           # Lazy Load Directive
│   │   ├── drag-drop.directive.ts           # Custom Drag-Drop Directive (CDK)
│   │   └── index.ts
│   │
│   ├── pipes/                                # Shared Pipes
│   │   ├── date-ago.pipe.ts                 # Date Ago Pipe (相對時間)
│   │   ├── file-size.pipe.ts                # File Size Pipe
│   │   ├── highlight.pipe.ts                # Highlight Pipe
│   │   ├── safe-html.pipe.ts                # Safe HTML Pipe
│   │   ├── truncate.pipe.ts                 # Truncate Pipe
│   │   ├── user-display-name.pipe.ts        # User Display Name Pipe
│   │   ├── workspace-filter.pipe.ts         # Workspace Filter Pipe
│   │   ├── task-status-color.pipe.ts        # Task Status Color Pipe
│   │   └── index.ts
│   │
│   ├── validators/                           # Shared Validators (表單驗證器)
│   │   ├── email.validator.ts               # Email Validator
│   │   ├── slug.validator.ts                # Slug Validator
│   │   ├── url.validator.ts                 # URL Validator
│   │   ├── password-strength.validator.ts   # Password Strength Validator
│   │   ├── unique-workspace-name.validator.ts  # Unique Workspace Name Validator (async)
│   │   └── index.ts
│   │
│   └── index.ts                              # Shared 總匯出
│
├── core/                                      # Core Module (核心模組)
│   │
│   ├── toolbar/                              # App Toolbar (MatToolbar)
│   │   ├── toolbar.component.ts
│   │   ├── toolbar.component.html
│   │   ├── toolbar.component.scss
│   │   └── index.ts
│   │
│   ├── sidenav/                              # App Sidenav (MatSidenav)
│   │   ├── sidenav.component.ts
│   │   ├── sidenav.component.html
│   │   ├── sidenav.component.scss
│   │   └── index.ts
│   │
│   ├── footer/                               # App Footer
│   │   ├── footer.component.ts
│   │   ├── footer.component.html
│   │   ├── footer.component.scss
│   │   └── index.ts
│   │
│   ├── user-menu/                            # User Menu (MatMenu)
│   │   ├── user-menu.component.ts
│   │   ├── user-menu.component.html
│   │   ├── user-menu.component.scss
│   │   └── index.ts
│   │
│   ├── notification-center/                  # Notification Center (MatBadge + MatMenu)
│   │   ├── notification-center.component.ts
│   │   ├── notification-center.component.html
│   │   ├── notification-center.component.scss
│   │   └── index.ts
│   │
│   └── index.ts                              # Core 總匯出
│
├── theme/                                     # Material Design 3 主題配置
│   │
│   ├── palettes/                             # 調色盤定義
│   │   ├── primary.palette.scss             # Primary 主色調色盤
│   │   ├── accent.palette.scss              # Accent 強調色調色盤
│   │   ├── warn.palette.scss                # Warn 警告色調色盤
│   │   └── index.scss
│   │
│   ├── typography/                           # 字型配置
│   │   ├── typography.config.scss           # Material 字型配置
│   │   └── custom-fonts.scss                # 自訂字型
│   │
│   ├── components/                           # 組件主題覆寫
│   │   ├── button.theme.scss                # MatButton 主題
│   │   ├── card.theme.scss                  # MatCard 主題
│   │   ├── table.theme.scss                 # MatTable 主題
│   │   ├── dialog.theme.scss                # MatDialog 主題
│   │   └── index.scss
│   │
│   ├── density/                              # Material 3 密度配置
│   │   ├── density.config.scss              # 密度設定
│   │   └── index.scss
│   │
│   ├── light-theme.scss                      # Light Theme 定義
│   ├── dark-theme.scss                       # Dark Theme 定義
│   ├── theme.scss                            # 主題總匯出
│   └── index.scss
│
└── index.ts                                   # Presentation Layer 總匯出
```

---

## 關鍵設計原則 (Material Design 3 版本)

### 1. 組件命名規範 - 避免 Copilot 混淆

#### Page Component 命名 (智能容器組件)
```
✅ CORRECT (避免混淆):
- task-list-page.component.ts          # Page 組件 (加 -page 後綴)
- workspace-home-page.component.ts     # Page 組件
- member-list-page.component.ts        # Page 組件

功能:
- 連接 Store (使用 inject(Store))
- 處理路由參數
- 協調多個 Presentation Component
- 處理頁面級別的邏輯

❌ WRONG (容易混淆):
- task-list.component.ts               # 與 Presentation Component 混淆
- tasks.component.ts                   # 太模糊
- list-page.component.ts               # 不知道列出什麼
```

#### Presentation Component 命名 (展示組件)
```
✅ CORRECT:
- task-list.component.ts               # Presentation Component (不加 -page)
- task-item.component.ts               # Presentation Component
- workspace-card.component.ts          # Presentation Component

功能:
- 純展示組件 (@Input, @Output)
- 不直接連接 Store
- 高度可重用
- 無副作用

❌ WRONG:
- tasks.component.ts                   # 太模糊
- list.component.ts                    # 完全無法識別
- task-component.ts                    # 冗餘
```

#### Dialog Component 命名 (MatDialog)
```
✅ CORRECT:
- task-create-dialog.component.ts      # Dialog 組件 (加 -dialog 後綴)
- workspace-create-dialog.component.ts # Dialog 組件
- member-invite-dialog.component.ts    # Dialog 組件

注意:
- Material 使用 Dialog 而非 Modal
- 使用 MatDialog 服務打開
- 使用 MatDialogRef 關閉
- 使用 MAT_DIALOG_DATA 注入資料

❌ WRONG:
- create-task.component.ts             # 不知道是 dialog 還是 page
- task-modal.component.ts              # Material 用 Dialog 不用 Modal
- task-dialog.component.ts             # 太模糊,不知道做什麼
```

---

### 2. Angular Material 20 核心模組

#### 必須使用的 Material 模組
```typescript
// Layout Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

// Button & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Form Controls
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

// Data Display
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';

// Feedback
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// CDK Modules (重要!)
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
```

---

### 3. Angular 20 控制流語法 (必須使用)

```html
<!-- ✅ CORRECT: 使用新的控制流語法 -->

<!-- 條件渲染 -->
@if (isLoading()) {
  <mat-spinner />
} @else if (error()) {
  <app-error-state [error]="error()" />
} @else {
  <app-task-list [tasks]="tasks()" />
}

<!-- 列表渲染 -->
@for (task of tasks(); track task.id) {
  <app-task-item [task]="task" />
} @empty {
  <app-empty-state message="沒有任務" />
}

<!-- Switch -->
@switch (status()) {
  @case ('pending') {
    <mat-chip color="primary">待處理</mat-chip>
  }
  @case ('completed') {
    <mat-chip color="accent">已完成</mat-chip>
  }
  @default {
    <mat-chip>未知</mat-chip>
  }
}

<!-- 延遲載入 -->
@defer (on viewport) {
  <app-heavy-component />
} @placeholder {
  <mat-progress-spinner mode="indeterminate" />
} @loading {
  <mat-spinner />
}

<!-- ❌ WRONG: 禁止使用舊版結構型指令 -->
<div *ngIf="isLoading">...</div>           <!-- ❌ 禁止 -->
<div *ngFor="let task of tasks">...</div>  <!-- ❌ 禁止 -->
<div [ngSwitch]="status">...</div>         <!-- ❌ 禁止 -->
```

---

### 4. Material Design 3 主題配置

#### 主題檔案結構
```scss
// theme/light-theme.scss

@use '@angular/material' as mat;

// 1. 定義調色盤 (Material Design 3)
$primary-palette: mat.define-palette(mat.$azure-palette);
$accent-palette: mat.define-palette(mat.$blue-palette);
$warn-palette: mat.define-palette(mat.$red-palette);

// 2. 建立主題
$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $primary-palette,
    tertiary: $accent-palette,
  ),
  typography: (
    // 使用 Material 3 字型系統
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
  density: (
    scale: 0, // Material 3 密度等級 (-5 到 0)
  )
));

// 3. 套用主題到所有組件
@include mat.all-component-themes($light-theme);

// 4. 自訂組件主題
@include mat.button-density(-2); // 較緊湊的按鈕
@include mat.card-theme($light-theme);
@include mat.table-theme($light-theme);
```

```scss
// theme/dark-theme.scss

@use '@angular/material' as mat;

$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.define-palette(mat.$azure-palette),
    tertiary: mat.define-palette(mat.$blue-palette),
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
  density: (
    scale: 0,
  )
));

@include mat.all-component-themes($dark-theme);
```

#### 在 Angular 中使用主題
```typescript
// app.component.ts

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div [class]="themeClass()">
      <router-outlet />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class AppComponent {
  // Theme State
  protected readonly isDarkMode = signal(false);
  
  protected readonly themeClass = computed(() => 
    this.isDarkMode() ? 'dark-theme' : 'light-theme'
  );
  
  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
  }
}
```

```scss
// styles.scss (全域樣式)

@use '@angular/material' as mat;
@use './app/presentation/theme/light-theme' as light;
@use './app/presentation/theme/dark-theme' as dark;

// 包含核心樣式 (只需包含一次)
@include mat.core();

// Light Theme (預設)
.light-theme {
  @include light.theme;
}

// Dark Theme
.dark-theme {
  @include dark.theme;
}

// 全域重置
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: Roboto, "Helvetica Neue", sans-serif;
}
```

---

### 5. Page Component 範例 (Material 版本)

```typescript
// features/tasks/pages/task-list-page/task-list-page.component.ts

/**
 * Task List Page Component (Material Design 3)
 * 
 * 職責:
 * - 連接 TasksStore
 * - 處理路由參數
 * - 協調多個 Presentation Components
 * - 使用 Material Components
 * 
 * 命名規則:
 * - 檔案名稱: task-list-page.component.ts (加 -page 後綴)
 * - 類別名稱: TaskListPageComponent
 * - Selector: app-task-list-page
 */
@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    // Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    
    // Presentation Components
    TaskListComponent,
    TaskFilterBarComponent,
  ],
  templateUrl: './task-list-page.component.html',
  styleUrl: './task-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListPageComponent {
  
  // Inject Stores
  private readonly tasksStore = inject(TasksStore);
  private readonly workspaceStore = inject(WorkspaceStore);
  
  // Inject Material Services
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  
  // Signals from Stores
  protected readonly tasks = this.tasksStore.filteredTasks;
  protected readonly loading = this.tasksStore.loading;
  protected readonly error = this.tasksStore.error;
  protected readonly currentWorkspace = this.workspaceStore.workspace;
  
  // Local State
  protected readonly selectedTaskIds = signal<string[]>([]);
  
  // Computed
  protected readonly hasSelection = computed(() => 
    this.selectedTaskIds().length > 0
  );
  
  // Lifecycle
  constructor() {
    effect(() => {
      const workspaceId = this.workspaceStore.workspace()?.id;
      if (workspaceId) {
        this.tasksStore.loadTasks();
      }
    });
  }
  
  // Event Handlers
  protected onCreateTask(): void {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '600px',
      data: {
        workspaceId: this.currentWorkspace()?.id
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksStore.addTask(result);
        this.snackBar.open('任務創建成功', '關閉', {
          duration: 3000,
        });
      }
    });
  }
  
  protected onFilterChange(filters: TaskFilters): void {
    this.tasksStore.setFilters(filters);
  }
}
```

```html
<!-- features/tasks/pages/task-list-page/task-list-page.component.html -->

<div class="task-list-page">
  <!-- Toolbar -->
  <mat-toolbar color="primary">
    <span>任務列表</span>
    <span class="spacer"></span>
    
    <!-- Actions -->
    <button 
      mat-raised-button 
      color="accent"
      (click)="onCreateTask()"
    >
      <mat-icon>add</mat-icon>
      創建任務
    </button>
    
    <!-- More Menu -->
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>
        <mat-icon>download</mat-icon>
        匯出
      </button>
      <button mat-menu-item>
        <mat-icon>settings</mat-icon>
        設定
      </button>
    </mat-menu>
  </mat-toolbar>
  
  <!-- Content -->
  <div class="task-list-page__content">
    <!-- Filter Bar -->
    <app-task-filter-bar
      (filterChange)="onFilterChange($event)"
    />
    
    <!-- Task List -->
    @if (loading()) {
      <div class="loading-container">
        <mat-spinner diameter="50" />
      </div>
    } @else if (error()) {
      <app-error-state [error]="error()" />
    } @else {
      <app-task-list
        [tasks]="tasks()"
        (taskClick)="onTaskClick($event)"
      />
    }
  </div>
</div>
```

```scss
// features/tasks/pages/task-list-page/task-list-page.component.scss

@use '@angular/material' as mat;

.task-list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &__content {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }
}

.spacer {
  flex: 1 1 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
```

---

### 6. CDK Drag-Drop 範例 (Kanban Board)

```typescript
// features/tasks/components/task-kanban-board/task-kanban-board.component.ts

import { CdkDragDrop, moveItemInArray, transferArrayBetweenArrays } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-kanban-board',
  standalone: true,
  imports: [
    DragDropModule,
    MatCardModule,
    MatIconModule,
    TaskKanbanColumnComponent,
  ],
  templateUrl: './task-kanban-board.component.html',
  styleUrl: './task-kanban-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskKanbanBoardComponent {
  
  // Input
  tasks = input.required<Task[]>();
  
  // Output
  taskMoved = output<{ task: Task; newStatus: TaskStatus }>();
  
  // Computed - 依狀態分組任務
  protected readonly tasksByStatus = computed(() => {
    const tasks = this.tasks();
    return {
      pending: tasks.filter(t => t.status === 'pending'),
      inProgress: tasks.filter(t => t.status === 'in-progress'),
      review: tasks.filter(t => t.status === 'review'),
      completed: tasks.filter(t => t.status === 'completed'),
    };
  });
  
  // Drag-Drop Handler
  protected onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      // 同一列內移動
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // 跨列移動
      const task = event.previousContainer.data[event.previousIndex];
      
      transferArrayBetweenArrays(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // 發送狀態變更事件
      this.taskMoved.emit({ task, newStatus });
    }
  }
}
```

```html
<!-- features/tasks/components/task-kanban-board/task-kanban-board.component.html -->

<div class="kanban-board">
  <!-- Pending Column -->
  <app-task-kanban-column
    title="待處理"
    [tasks]="tasksByStatus().pending"
    status="pending"
    (dropped)="onDrop($event, 'pending')"
  />
  
  <!-- In Progress Column -->
  <app-task-kanban-column
    title="進行中"
    [tasks]="tasksByStatus().inProgress"
    status="in-progress"
    (dropped)="onDrop($event, 'in-progress')"
  />
  
  <!-- Review Column -->
  <app-task-kanban-column
    title="審核中"
    [tasks]="tasksByStatus().review"
    status="review"
    (dropped)="onDrop($event, 'review')"
  />
  
  <!-- Completed Column -->
  <app-task-kanban-column
    title="已完成"
    [tasks]="tasksByStatus().completed"
    status="completed"
    (dropped)="onDrop($event, 'completed')"
  />
</div>
```

```typescript
// features/tasks/components/task-kanban-column/task-kanban-column.component.ts

@Component({
  selector: 'app-task-kanban-column',
  standalone: true,
  imports: [
    DragDropModule,
    MatCardModule,
    MatIconModule,
    TaskItemComponent,
  ],
  template: `
    <div class="kanban-column">
      <div class="kanban-column__header">
        <h3>{{ title() }}</h3>
        <span class="task-count">{{ tasks().length }}</span>
      </div>
      
      <div
        cdkDropList
        [cdkDropListData]="tasks()"
        [cdkDropListConnectedTo]="connectedLists()"
        (cdkDropListDropped)="dropped.emit($event)"
        class="kanban-column__list"
      >
        @for (task of tasks(); track task.id) {
          <mat-card cdkDrag class="task-card">
            <app-task-item [task]="task" />
          </mat-card>
        } @empty {
          <div class="empty-column">
            <mat-icon>inbox</mat-icon>
            <p>沒有任務</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './task-kanban-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskKanbanColumnComponent {
  title = input.required<string>();
  tasks = input.required<Task[]>();
  status = input.required<TaskStatus>();
  connectedLists = input<string[]>([]);
  
  dropped = output<CdkDragDrop<Task[]>>();
}
```

---

### 7. MatTable 使用範例

```typescript
// features/members/components/member-list/member-list.component.ts

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListComponent implements AfterViewInit {
  
  // ViewChild
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Input
  members = input.required<Member[]>();
  
  // Output
  memberClick = output<Member>();
  roleChange = output<{ member: Member; newRole: MembershipRole }>();
  removeMember = output<Member>();
  
  // Table Configuration
  protected readonly displayedColumns = ['avatar', 'name', 'email', 'role', 'joinedAt', 'actions'];
  
  // Data Source (使用 computed 自動更新)
  protected readonly dataSource = computed(() => {
    const data = new MatTableDataSource(this.members());
    
    // 在下一個 tick 設定 sort 和 paginator
    setTimeout(() => {
      data.sort = this.sort;
      data.paginator = this.paginator;
    });
    
    return data;
  });
  
  ngAfterViewInit() {
    // Sort 和 Paginator 會在 computed 中設定
  }
  
  // Event Handlers
  protected onRoleChange(member: Member, newRole: MembershipRole): void {
    this.roleChange.emit({ member, newRole });
  }
  
  protected onRemoveMember(member: Member): void {
    this.removeMember.emit(member);
  }
}
```

```html
<!-- features/members/components/member-list/member-list.component.html -->

<div class="member-list">
  <table mat-table [dataSource]="dataSource()" matSort>
    
    <!-- Avatar Column -->
    <ng-container matColumnDef="avatar">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let member">
        <app-avatar [user]="member" size="small" />
      </td>
    </ng-container>
    
    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>姓名</th>
      <td mat-cell *matCellDef="let member">{{ member.name }}</td>
    </ng-container>
    
    <!-- Email Column -->
    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>電子郵件</th>
      <td mat-cell *matCellDef="let member">{{ member.email }}</td>
    </ng-container>
    
    <!-- Role Column -->
    <ng-container matColumnDef="role">
      <th mat-header-cell *matHeaderCellDef>角色</th>
      <td mat-cell *matCellDef="let member">
        <mat-chip>{{ member.role }}</mat-chip>
      </td>
    </ng-container>
    
    <!-- Joined At Column -->
    <ng-container matColumnDef="joinedAt">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>加入時間</th>
      <td mat-cell *matCellDef="let member">
        {{ member.joinedAt | dateAgo }}
      </td>
    </ng-container>
    
    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let member">
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onRoleChange(member, 'admin')">
            <mat-icon>admin_panel_settings</mat-icon>
            設為管理員
          </button>
          <button mat-menu-item (click)="onRemoveMember(member)">
            <mat-icon>person_remove</mat-icon>
            移除成員
          </button>
        </mat-menu>
      </td>
    </ng-container>
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr 
      mat-row 
      *matRowDef="let row; columns: displayedColumns;"
      (click)="memberClick.emit(row)"
      class="clickable-row"
    ></tr>
  </table>
  
  <mat-paginator
    [pageSizeOptions]="[10, 25, 50, 100]"
    showFirstLastButtons
  />
</div>
```

---

### 8. MatDialog 使用範例

```typescript
// features/tasks/components/task-create-dialog/task-create-dialog.component.ts

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface TaskCreateDialogData {
  workspaceId: string;
}

export interface TaskCreateDialogResult {
  title: string;
  description: string;
  assigneeId: string | null;
  deadline: Date | null;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './task-create-dialog.component.html',
  styleUrl: './task-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateDialogComponent {
  
  // Inject Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TaskCreateDialogComponent>);
  protected readonly data = inject<TaskCreateDialogData>(MAT_DIALOG_DATA);
  
  // Form
  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    assigneeId: [null as string | null],
    deadline: [null as Date | null],
    priority: ['medium' as const, Validators.required],
  });
  
  // Form Value as Signal
  protected readonly formValue = toSignal(
    this.form.valueChanges,
    { initialValue: this.form.value }
  );
  
  // Computed
  protected readonly canSubmit = computed(() => 
    this.form.valid
  );
  
  // Event Handlers
  protected onSubmit(): void {
    if (this.form.valid) {
      const result: TaskCreateDialogResult = {
        title: this.form.value.title!,
        description: this.form.value.description || '',
        assigneeId: this.form.value.assigneeId || null,
        deadline: this.form.value.deadline || null,
        priority: this.form.value.priority!,
      };
      
      this.dialogRef.close(result);
    }
  }
  
  protected onCancel(): void {
    this.dialogRef.close();
  }
}
```

```html
<!-- features/tasks/components/task-create-dialog/task-create-dialog.component.html -->

<h2 mat-dialog-title>創建任務</h2>

<mat-dialog-content>
  <form [formGroup]="form">
    <!-- Title -->
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>任務標題</mat-label>
      <input matInput formControlName="title" required />
      @if (form.controls.title.hasError('required')) {
        <mat-error>標題為必填</mat-error>
      }
      @if (form.controls.title.hasError('maxlength')) {
        <mat-error>標題不能超過 100 字元</mat-error>
      }
    </mat-form-field>
    
    <!-- Description -->
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>描述</mat-label>
      <textarea 
        matInput 
        formControlName="description"
        rows="4"
      ></textarea>
    </mat-form-field>
    
    <!-- Assignee -->
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>指派給</mat-label>
      <mat-select formControlName="assigneeId">
        <mat-option [value]="null">未指派</mat-option>
        <!-- Options from store -->
      </mat-select>
    </mat-form-field>
    
    <!-- Deadline -->
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>截止日期</mat-label>
      <input matInput [matDatepicker]="picker" formControlName="deadline" />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker />
    </mat-form-field>
    
    <!-- Priority -->
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>優先級</mat-label>
      <mat-select formControlName="priority" required>
        <mat-option value="low">低</mat-option>
        <mat-option value="medium">中</mat-option>
        <mat-option value="high">高</mat-option>
      </mat-select>
    </mat-form-field>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onCancel()">取消</button>
  <button 
    mat-raised-button 
    color="primary"
    [disabled]="!canSubmit()"
    (click)="onSubmit()"
  >
    創建
  </button>
</mat-dialog-actions>
```

---

### 9. CDK Virtual Scroll 範例

```typescript
// features/journal/components/activity-feed/activity-feed.component.ts

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [
    ScrollingModule,
    MatListModule,
    MatIconModule,
    ActivityItemComponent,
  ],
  template: `
    <cdk-virtual-scroll-viewport itemSize="80" class="activity-feed">
      @for (activity of activities(); track activity.id) {
        <app-activity-item [activity]="activity" />
      } @empty {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>沒有活動記錄</p>
        </div>
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .activity-feed {
      height: 600px;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(0, 0, 0, 0.54);
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent {
  activities = input.required<Activity[]>();
}
```

---

### 10. Responsive Layout with Material

```typescript
// layouts/shell/shell-layout.component.ts

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLayoutComponent {
  
  private readonly breakpointObserver = inject(BreakpointObserver);
  
  // Responsive Signals
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );
  
  protected readonly isTablet = toSignal(
    this.breakpointObserver.observe(Breakpoints.Tablet).pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );
  
  // Sidenav State
  protected readonly sidenavOpened = signal(true);
  protected readonly sidenavMode = computed(() => 
    this.isHandset() ? 'over' : 'side'
  );
  
  toggleSidenav(): void {
    this.sidenavOpened.update(v => !v);
  }
}
```

```html
<!-- layouts/shell/shell-layout.component.html -->

<mat-sidenav-container class="shell-container">
  <!-- Sidenav -->
  <mat-sidenav
    [mode]="sidenavMode()"
    [opened]="sidenavOpened()"
    class="shell-sidenav"
  >
    <mat-toolbar color="primary">
      <span>選單</span>
    </mat-toolbar>
    
    <mat-nav-list>
      <a mat-list-item routerLink="/overview">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>概覽</span>
      </a>
      <a mat-list-item routerLink="/tasks">
        <mat-icon matListItemIcon>task</mat-icon>
        <span matListItemTitle>任務</span>
      </a>
      <a mat-list-item routerLink="/documents">
        <mat-icon matListItemIcon>folder</mat-icon>
        <span matListItemTitle>文件</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>
  
  <!-- Main Content -->
  <mat-sidenav-content>
    <!-- Toolbar -->
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>工作區協作系統</span>
      <span class="spacer"></span>
      
      <!-- User Menu -->
      <app-user-menu />
      
      <!-- Notification Center -->
      <app-notification-center />
    </mat-toolbar>
    
    <!-- Router Outlet -->
    <div class="content">
      <router-outlet />
    </div>
  </mat-sidenav-content>
</mat-sidenav-container>
```

---

## Copilot 友善的命名檢查清單

### ✅ Component 命名檢查
- [ ] Page Component 包含 `-page` 後綴
- [ ] Dialog Component 包含 `-dialog` 後綴 (不是 -modal)
- [ ] Presentation Component 不包含 `-page` 後綴
- [ ] 檔名與資料夾名一致
- [ ] 使用 kebab-case 命名

### ✅ Material 使用檢查
- [ ] 使用 MatDialog 而非自定義 Modal
- [ ] 使用 MatSnackBar 而非 Toast
- [ ] 使用 MatSidenav 而非 Sidebar
- [ ] 使用 MatToolbar 而非 Header
- [ ] 所有 Material 組件都正確匯入

### ✅ 模板語法檢查
- [ ] 使用 `@if` 替代 `*ngIf`
- [ ] 使用 `@for` 替代 `*ngFor`
- [ ] 使用 `@switch` 替代 `*ngSwitch`
- [ ] 使用 `track` 屬性在 `@for` 中
- [ ] 使用 `@defer` 進行延遲載入

### ✅ Signal 使用檢查
- [ ] 使用 `input()` 定義輸入
- [ ] 使用 `output()` 定義輸出
- [ ] 使用 `signal()` 定義本地狀態
- [ ] 使用 `computed()` 定義衍生狀態
- [ ] 使用 `effect()` 處理副作用

### ✅ CDK 使用檢查
- [ ] Drag-Drop 使用 CDK DragDropModule
- [ ] Virtual Scroll 使用 CDK ScrollingModule
- [ ] Tree 使用 CDK TreeModule
- [ ] Overlay 使用 CDK OverlayModule

### ✅ 主題檢查
- [ ] 使用 Material Design 3 主題系統
- [ ] 正確設定 color palette
- [ ] 正確設定 typography
- [ ] 正確設定 density
- [ ] 支援 Light/Dark Mode

---

## 開發順序建議

1. **Material Theme 配置** (theme/)
   - Light Theme
   - Dark Theme
   - Typography
   - Component Overrides

2. **Layouts** (layouts/)
   - Shell Layout (MatSidenav + MatToolbar)
   - Workspace Layout
   - Auth Layout

3. **Shared Components** (shared/components/)
   - UI Components (基於 Material)
   - Form Components (MatFormField, MatInput, etc.)
   - Data Display Components (MatTable, MatCard, etc.)

4. **Core Components** (core/)
   - Toolbar (MatToolbar)
   - Sidenav (MatSidenav)
   - User Menu (MatMenu)
   - Notification Center (MatBadge + MatMenu)

5. **Auth Feature** (features/auth/)
   - Login Page
   - Register Page
   - Auth Forms (MatFormField)

6. **Workspace List Feature** (features/workspace-list/)
   - Workspace List Page
   - Workspace Card (MatCard)
   - Workspace Create Dialog (MatDialog)

7. **Module Features** (features/{module}/)
   - Overview
   - Tasks (with CDK Drag-Drop)
   - Documents (with CDK Tree)
   - Members (with MatTable)
   - 其他模組...

這樣的順序可以確保:
- Material 主題優先配置
- 從基礎到複雜
- CDK 功能逐步整合
- 可重用組件優先
- 易於測試和調試