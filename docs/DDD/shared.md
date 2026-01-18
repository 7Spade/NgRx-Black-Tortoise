# Shared Layer 檔案樹結構 (Material Design 3 版本)

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

Shared Layer 是整個應用的共享層,提供可重用的組件、指令、管道、驗證器等。

根據您的架構和 **Angular 20 + Angular Material 20 (Material Design 3) + CDK** 技術棧,以下是 `src/app/shared` 的完整檔案樹:

```
src/app/shared/
│
├── components/                                # Shared Components (共享組件)
│   │
│   ├── ui/                                   # UI Components (基礎 UI 元件)
│   │   │
│   │   ├── button/                          # Custom Button (擴展 MatButton)
│   │   │   ├── button.component.ts
│   │   │   ├── button.component.html
│   │   │   ├── button.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── icon-button/                     # Icon Button (擴展 MatIconButton)
│   │   │   ├── icon-button.component.ts
│   │   │   ├── icon-button.component.html
│   │   │   ├── icon-button.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── avatar/                          # Avatar Component
│   │   │   ├── avatar.component.ts
│   │   │   ├── avatar.component.html
│   │   │   ├── avatar.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── avatar-group/                    # Avatar Group (多個頭像堆疊)
│   │   │   ├── avatar-group.component.ts
│   │   │   ├── avatar-group.component.html
│   │   │   ├── avatar-group.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── chip/                            # Custom Chip (擴展 MatChip)
│   │   │   ├── chip.component.ts
│   │   │   ├── chip.component.html
│   │   │   ├── chip.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── status-chip/                     # Status Chip (帶顏色的狀態標籤)
│   │   │   ├── status-chip.component.ts
│   │   │   ├── status-chip.component.html
│   │   │   ├── status-chip.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── priority-chip/                   # Priority Chip (優先級標籤)
│   │   │   ├── priority-chip.component.ts
│   │   │   ├── priority-chip.component.html
│   │   │   ├── priority-chip.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── loading-spinner/                 # Loading Spinner (MatProgressSpinner)
│   │   │   ├── loading-spinner.component.ts
│   │   │   ├── loading-spinner.component.html
│   │   │   ├── loading-spinner.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── progress-bar/                    # Progress Bar (MatProgressBar)
│   │   │   ├── progress-bar.component.ts
│   │   │   ├── progress-bar.component.html
│   │   │   ├── progress-bar.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── skeleton/                        # Skeleton Loader (載入骨架)
│   │   │   ├── skeleton.component.ts
│   │   │   ├── skeleton.component.html
│   │   │   ├── skeleton.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── empty-state/                     # Empty State (空狀態)
│   │   │   ├── empty-state.component.ts
│   │   │   ├── empty-state.component.html
│   │   │   ├── empty-state.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── error-state/                     # Error State (錯誤狀態)
│   │   │   ├── error-state.component.ts
│   │   │   ├── error-state.component.html
│   │   │   ├── error-state.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── divider/                         # Custom Divider (MatDivider)
│   │   │   ├── divider.component.ts
│   │   │   ├── divider.component.html
│   │   │   ├── divider.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── badge/                           # Custom Badge (MatBadge)
│   │   │   ├── badge.component.ts
│   │   │   ├── badge.component.html
│   │   │   ├── badge.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── form/                                # Form Components (表單元件)
│   │   │
│   │   ├── form-field/                     # Form Field Wrapper (MatFormField)
│   │   │   ├── form-field.component.ts
│   │   │   ├── form-field.component.html
│   │   │   ├── form-field.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── input/                          # Custom Input (MatInput)
│   │   │   ├── input.component.ts
│   │   │   ├── input.component.html
│   │   │   ├── input.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── textarea/                       # Custom Textarea (MatInput)
│   │   │   ├── textarea.component.ts
│   │   │   ├── textarea.component.html
│   │   │   ├── textarea.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── select/                         # Custom Select (MatSelect)
│   │   │   ├── select.component.ts
│   │   │   ├── select.component.html
│   │   │   ├── select.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── autocomplete/                   # Custom Autocomplete (MatAutocomplete)
│   │   │   ├── autocomplete.component.ts
│   │   │   ├── autocomplete.component.html
│   │   │   ├── autocomplete.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── checkbox/                       # Custom Checkbox (MatCheckbox)
│   │   │   ├── checkbox.component.ts
│   │   │   ├── checkbox.component.html
│   │   │   ├── checkbox.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── radio-group/                    # Custom Radio Group (MatRadioGroup)
│   │   │   ├── radio-group.component.ts
│   │   │   ├── radio-group.component.html
│   │   │   ├── radio-group.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── slide-toggle/                   # Custom Slide Toggle (MatSlideToggle)
│   │   │   ├── slide-toggle.component.ts
│   │   │   ├── slide-toggle.component.html
│   │   │   ├── slide-toggle.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── slider/                         # Custom Slider (MatSlider)
│   │   │   ├── slider.component.ts
│   │   │   ├── slider.component.html
│   │   │   ├── slider.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── datepicker/                     # Custom Datepicker (MatDatepicker)
│   │   │   ├── datepicker.component.ts
│   │   │   ├── datepicker.component.html
│   │   │   ├── datepicker.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── date-range-picker/              # Date Range Picker (MatDateRangePicker)
│   │   │   ├── date-range-picker.component.ts
│   │   │   ├── date-range-picker.component.html
│   │   │   ├── date-range-picker.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── timepicker/                     # Time Picker (自定義或第三方)
│   │   │   ├── timepicker.component.ts
│   │   │   ├── timepicker.component.html
│   │   │   ├── timepicker.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── color-picker/                   # Color Picker
│   │   │   ├── color-picker.component.ts
│   │   │   ├── color-picker.component.html
│   │   │   ├── color-picker.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── file-uploader/                  # File Uploader (基於 CDK)
│   │   │   ├── file-uploader.component.ts
│   │   │   ├── file-uploader.component.html
│   │   │   ├── file-uploader.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── image-uploader/                 # Image Uploader (帶預覽)
│   │   │   ├── image-uploader.component.ts
│   │   │   ├── image-uploader.component.html
│   │   │   ├── image-uploader.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── rich-text-editor/               # Rich Text Editor (TinyMCE 或 Quill)
│   │   │   ├── rich-text-editor.component.ts
│   │   │   ├── rich-text-editor.component.html
│   │   │   ├── rich-text-editor.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── markdown-editor/                # Markdown Editor
│   │   │   ├── markdown-editor.component.ts
│   │   │   ├── markdown-editor.component.html
│   │   │   ├── markdown-editor.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── tag-input/                      # Tag Input (標籤輸入)
│   │   │   ├── tag-input.component.ts
│   │   │   ├── tag-input.component.html
│   │   │   ├── tag-input.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── user-selector/                  # User Selector (用戶選擇器)
│   │   │   ├── user-selector.component.ts
│   │   │   ├── user-selector.component.html
│   │   │   ├── user-selector.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── data-display/                       # Data Display Components (資料展示元件)
│   │   │
│   │   ├── data-table/                     # Data Table (基於 MatTable + CDK)
│   │   │   ├── data-table.component.ts
│   │   │   ├── data-table.component.html
│   │   │   ├── data-table.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── virtual-table/                  # Virtual Table (CDK Virtual Scroll + MatTable)
│   │   │   ├── virtual-table.component.ts
│   │   │   ├── virtual-table.component.html
│   │   │   ├── virtual-table.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── tree/                           # Tree Component (CDK Tree)
│   │   │   ├── tree.component.ts
│   │   │   ├── tree.component.html
│   │   │   ├── tree.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── nested-tree/                    # Nested Tree (CDK Nested Tree)
│   │   │   ├── nested-tree.component.ts
│   │   │   ├── nested-tree.component.html
│   │   │   ├── nested-tree.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── pagination/                     # Pagination (MatPaginator)
│   │   │   ├── pagination.component.ts
│   │   │   ├── pagination.component.html
│   │   │   ├── pagination.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── card/                           # Custom Card (MatCard)
│   │   │   ├── card.component.ts
│   │   │   ├── card.component.html
│   │   │   ├── card.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── stat-card/                      # Stat Card (統計卡片)
│   │   │   ├── stat-card.component.ts
│   │   │   ├── stat-card.component.html
│   │   │   ├── stat-card.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── info-card/                      # Info Card (資訊卡片)
│   │   │   ├── info-card.component.ts
│   │   │   ├── info-card.component.html
│   │   │   ├── info-card.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── expansion-panel/                # Custom Expansion Panel (MatExpansionPanel)
│   │   │   ├── expansion-panel.component.ts
│   │   │   ├── expansion-panel.component.html
│   │   │   ├── expansion-panel.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── list/                           # Custom List (MatList)
│   │   │   ├── list.component.ts
│   │   │   ├── list.component.html
│   │   │   ├── list.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── virtual-list/                   # Virtual List (CDK Virtual Scroll)
│   │   │   ├── virtual-list.component.ts
│   │   │   ├── virtual-list.component.html
│   │   │   ├── virtual-list.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── timeline/                       # Timeline Component (時間軸)
│   │   │   ├── timeline.component.ts
│   │   │   ├── timeline.component.html
│   │   │   ├── timeline.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── stepper/                        # Custom Stepper (MatStepper)
│   │   │   ├── stepper.component.ts
│   │   │   ├── stepper.component.html
│   │   │   ├── stepper.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── navigation/                         # Navigation Components (導航元件)
│   │   │
│   │   ├── breadcrumb/                     # Breadcrumb (麵包屑)
│   │   │   ├── breadcrumb.component.ts
│   │   │   ├── breadcrumb.component.html
│   │   │   ├── breadcrumb.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── tabs/                           # Custom Tabs (MatTabGroup)
│   │   │   ├── tabs.component.ts
│   │   │   ├── tabs.component.html
│   │   │   ├── tabs.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── nav-list/                       # Nav List (MatNavList)
│   │   │   ├── nav-list.component.ts
│   │   │   ├── nav-list.component.html
│   │   │   ├── nav-list.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── menu/                           # Custom Menu (MatMenu)
│   │   │   ├── menu.component.ts
│   │   │   ├── menu.component.html
│   │   │   ├── menu.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── context-menu/                   # Context Menu (右鍵選單)
│   │   │   ├── context-menu.component.ts
│   │   │   ├── context-menu.component.html
│   │   │   ├── context-menu.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── bottom-nav/                     # Bottom Navigation (底部導航)
│   │   │   ├── bottom-nav.component.ts
│   │   │   ├── bottom-nav.component.html
│   │   │   ├── bottom-nav.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── feedback/                           # Feedback Components (回饋元件)
│   │   │
│   │   ├── snackbar/                       # Snackbar Notification (MatSnackBar)
│   │   │   ├── snackbar.component.ts
│   │   │   ├── snackbar.component.html
│   │   │   ├── snackbar.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── confirm-dialog/                 # Confirm Dialog (MatDialog)
│   │   │   ├── confirm-dialog.component.ts
│   │   │   ├── confirm-dialog.component.html
│   │   │   ├── confirm-dialog.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── alert-dialog/                   # Alert Dialog (MatDialog)
│   │   │   ├── alert-dialog.component.ts
│   │   │   ├── alert-dialog.component.html
│   │   │   ├── alert-dialog.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── bottom-sheet/                   # Bottom Sheet (MatBottomSheet)
│   │   │   ├── bottom-sheet.component.ts
│   │   │   ├── bottom-sheet.component.html
│   │   │   ├── bottom-sheet.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── tooltip/                        # Custom Tooltip (MatTooltip)
│   │   │   ├── tooltip.component.ts
│   │   │   ├── tooltip.component.html
│   │   │   ├── tooltip.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── layout/                             # Layout Components (布局元件)
│   │   │
│   │   ├── container/                      # Container (容器)
│   │   │   ├── container.component.ts
│   │   │   ├── container.component.html
│   │   │   ├── container.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── grid/                           # Grid Layout (網格布局)
│   │   │   ├── grid.component.ts
│   │   │   ├── grid.component.html
│   │   │   ├── grid.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── flex/                           # Flex Layout (彈性布局)
│   │   │   ├── flex.component.ts
│   │   │   ├── flex.component.html
│   │   │   ├── flex.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── split-pane/                     # Split Pane (分割面板)
│   │   │   ├── split-pane.component.ts
│   │   │   ├── split-pane.component.html
│   │   │   ├── split-pane.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── media/                              # Media Components (媒體元件)
│   │   │
│   │   ├── image/                          # Image Component (帶載入狀態)
│   │   │   ├── image.component.ts
│   │   │   ├── image.component.html
│   │   │   ├── image.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── image-viewer/                   # Image Viewer (圖片檢視器)
│   │   │   ├── image-viewer.component.ts
│   │   │   ├── image-viewer.component.html
│   │   │   ├── image-viewer.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── video-player/                   # Video Player (影片播放器)
│   │   │   ├── video-player.component.ts
│   │   │   ├── video-player.component.html
│   │   │   ├── video-player.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── charts/                             # Chart Components (圖表元件)
│   │   │
│   │   ├── line-chart/                     # Line Chart (折線圖)
│   │   │   ├── line-chart.component.ts
│   │   │   ├── line-chart.component.html
│   │   │   ├── line-chart.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── bar-chart/                      # Bar Chart (柱狀圖)
│   │   │   ├── bar-chart.component.ts
│   │   │   ├── bar-chart.component.html
│   │   │   ├── bar-chart.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── pie-chart/                      # Pie Chart (圓餅圖)
│   │   │   ├── pie-chart.component.ts
│   │   │   ├── pie-chart.component.html
│   │   │   ├── pie-chart.component.scss
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── index.ts                            # Components 總匯出
│
├── directives/                             # Shared Directives
│   │
│   ├── access-control/                     # 權限控制指令
│   │   ├── has-permission.directive.ts     # Permission Check Directive
│   │   ├── has-role.directive.ts           # Role Check Directive
│   │   └── index.ts
│   │
│   ├── workspace/                          # Workspace 相關指令
│   │   ├── workspace-scoped.directive.ts   # Workspace Scope Directive
│   │   └── index.ts
│   │
│   ├── interaction/                        # 互動指令
│   │   ├── auto-focus.directive.ts         # Auto Focus Directive
│   │   ├── click-outside.directive.ts      # Click Outside Directive (CDK)
│   │   ├── long-press.directive.ts         # Long Press Directive
│   │   ├── double-click.directive.ts       # Double Click Directive
│   │   └── index.ts
│   │
│   ├── drag-drop/                          # 拖拽指令 (CDK)
│   │   ├── drag-handle.directive.ts        # Drag Handle Directive
│   │   ├── drop-zone.directive.ts          # Drop Zone Directive
│   │   └── index.ts
│   │
│   ├── scroll/                             # 滾動指令
│   │   ├── infinite-scroll.directive.ts    # Infinite Scroll Directive
│   │   ├── scroll-spy.directive.ts         # Scroll Spy Directive
│   │   ├── scroll-to.directive.ts          # Scroll To Directive
│   │   └── index.ts
│   │
│   ├── visibility/                         # 可見性指令
│   │   ├── lazy-load.directive.ts          # Lazy Load Directive
│   │   ├── intersection-observer.directive.ts # Intersection Observer Directive
│   │   └── index.ts
│   │
│   ├── validation/                         # 驗證指令
│   │   ├── match.directive.ts              # Match Validator Directive
│   │   ├── min-max.directive.ts            # Min Max Validator Directive
│   │   └── index.ts
│   │
│   ├── clipboard/                          # 剪貼簿指令 (CDK)
│   │   ├── copy-to-clipboard.directive.ts  # Copy to Clipboard Directive
│   │   └── index.ts
│   │
│   ├── resize/                             # Resize 指令
│   │   ├── resize-observer.directive.ts    # Resize Observer Directive
│   │   └── index.ts
│   │
│   └── index.ts                            # Directives 總匯出
│
├── pipes/                                  # Shared Pipes
│   │
│   ├── date/                              # 日期相關管道
│   │   ├── date-ago.pipe.ts               # Date Ago Pipe (相對時間)
│   │   ├── date-format.pipe.ts            # Date Format Pipe
│   │   ├── time-ago.pipe.ts               # Time Ago Pipe
│   │   └── index.ts
│   │
│   ├── string/                            # 字串相關管道
│   │   ├── truncate.pipe.ts               # Truncate Pipe (截斷文字)
│   │   ├── capitalize.pipe.ts             # Capitalize Pipe (首字母大寫)
│   │   ├── lowercase.pipe.ts              # Lowercase Pipe
│   │   ├── uppercase.pipe.ts              # Uppercase Pipe
│   │   ├── camel-case.pipe.ts             # Camel Case Pipe
│   │   ├── kebab-case.pipe.ts             # Kebab Case Pipe
│   │   ├── snake-case.pipe.ts             # Snake Case Pipe
│   │   ├── highlight.pipe.ts              # Highlight Pipe (高亮文字)
│   │   └── index.ts
│   │
│   ├── number/                            # 數字相關管道
│   │   ├── file-size.pipe.ts              # File Size Pipe (檔案大小格式化)
│   │   ├── bytes.pipe.ts                  # Bytes Pipe
│   │   ├── number-format.pipe.ts          # Number Format Pipe
│   │   ├── percentage.pipe.ts             # Percentage Pipe
│   │   ├── currency-format.pipe.ts        # Currency Format Pipe
│   │   └── index.ts
│   │
│   ├── array/                             # 陣列相關管道
│   │   ├── filter.pipe.ts                 # Filter Pipe
│   │   ├── sort.pipe.ts                   # Sort Pipe
│   │   ├── group-by.pipe.ts               # Group By Pipe
│   │   ├── pluck.pipe.ts                  # Pluck Pipe
│   │   └── index.ts
│   │
│   ├── user/                              # 用戶相關管道
│   │   ├── user-display-name.pipe.ts      # User Display Name Pipe
│   │   ├── user-initials.pipe.ts          # User Initials Pipe (用戶首字母)
│   │   ├── user-avatar.pipe.ts            # User Avatar Pipe
│   │   └── index.ts
│   │
│   ├── workspace/                         # Workspace 相關管道
│   │   ├── workspace-filter.pipe.ts       # Workspace Filter Pipe
│   │   ├── workspace-name.pipe.ts         # Workspace Name Pipe
│   │   └── index.ts
│   │
│   ├── task/                              # Task 相關管道
│   │   ├── task-status-color.pipe.ts      # Task Status Color Pipe
│   │   ├── task-status-icon.pipe.ts       # Task Status Icon Pipe
│   │   ├── task-priority-color.pipe.ts    # Task Priority Color Pipe
│   │   └── index.ts
│   │
│   ├── security/                          # 安全相關管道
│   │   ├── safe-html.pipe.ts              # Safe HTML Pipe
│   │   ├── safe-url.pipe.ts               # Safe URL Pipe
│   │   ├── safe-style.pipe.ts             # Safe Style Pipe
│   │   ├── safe-resource-url.pipe.ts      # Safe Resource URL Pipe
│   │   └── index.ts
│   │
│   ├── misc/                              # 其他管道
│   │   ├── default-value.pipe.ts          # Default Value Pipe
│   │   ├── callback.pipe.ts               # Callback Pipe
│   │   ├── memoize.pipe.ts                # Memoize Pipe (快取結果)
│   │   └── index.ts
│   │
│   └── index.ts                           # Pipes 總匯出
│
├── validators/                            # Shared Validators (表單驗證器)
│   │
│   ├── sync/                             # 同步驗證器
│   │   ├── email.validator.ts            # Email Validator
│   │   ├── url.validator.ts              # URL Validator
│   │   ├── phone.validator.ts            # Phone Validator
│   │   ├── slug.validator.ts             # Slug Validator
│   │   ├── password-strength.validator.ts # Password Strength Validator
│   │   ├── min-max.validator.ts          # Min Max Validator
│   │   ├── match.validator.ts            # Match Validator (兩個欄位相符)
│   │   ├── whitespace.validator.ts       # Whitespace Validator
│   │   ├── pattern.validator.ts          # Pattern Validator
│   │   └── index.ts
│   │
│   ├── async/                            # 非同步驗證器
│   │   ├── unique-email.validator.ts     # Unique Email Validator
│   │   ├── unique-username.validator.ts  # Unique Username Validator
│   │   ├── unique-workspace-name.validator.ts # Unique Workspace Name Validator
│   │   ├── unique-workspace-slug.validator.ts # Unique Workspace Slug Validator
│   │   └── index.ts
│   │
│   └── index.ts                          # Validators 總匯出
│
├── services/                              # Shared Services (共享服務)
│   │
│   ├── dialog/                           # Dialog 服務
│   │   ├── dialog.service.ts             # Dialog Service (封裝 MatDialog)
│   │   └── index.ts
│   │
│   ├── snackbar/                         # Snackbar 服務
│   │   ├── snackbar.service.ts           # Snackbar Service (封裝 MatSnackBar)
│   │   └── index.ts
│   │
│   ├── bottom-sheet/                     # Bottom Sheet 服務
│   │   ├── bottom-sheet.service.ts       # Bottom Sheet Service (封裝 MatBottomSheet)
│   │   └── index.ts
│   │
│   ├── clipboard/                        # 剪貼簿服務 (CDK)
│   │   ├── clipboard.service.ts          # Clipboard Service
│   │   └── index.ts
│   │
│   ├── overlay/                          # Overlay 服務 (CDK)
│   │   ├── overlay.service.ts            # Overlay Service
│   │   └── index.ts
│   │
│   ├── breakpoint/                       # Breakpoint 服務 (CDK Layout)
│   │   ├── breakpoint.service.ts         # Breakpoint Service
│   │   └── index.ts
│   │
│   ├── theme/                            # 主題服務
│   │   ├── theme.service.ts              # Theme Service (Light/Dark Mode)
│   │   └── index.ts
│   │
│   ├── local-storage/                    # Local Storage 服務
│   │   ├── local-storage.service.ts      # Local Storage Service
│   │   └── index.ts
│   │
│   ├── session-storage/                  # Session Storage 服務
│   │   ├── session-storage.service.ts    # Session Storage Service
│   │   └── index.ts
│   │
│   ├── indexed-db/                       # IndexedDB 服務
│   │   ├── indexed-db.service.ts         # IndexedDB Service
│   │   └── index.ts
│   │
│   ├── platform/                         # Platform 服務 (CDK)
│   │   ├── platform.service.ts           # Platform Service
│   │   └── index.ts
│   │
│   ├── media-query/                      # Media Query 服務
│   │   ├── media-query.service.ts        # Media Query Service
│   │   └── index.ts
│   │
│   ├── scroll/                           # Scroll 服務
│   │   ├── scroll.service.ts             # Scroll Service
│   │   └── index.ts
│   │
│   ├── file/                             # 檔案服務
│   │   ├── file.service.ts               # File Service
│   │   ├── file-reader.service.ts        # File Reader Service
│   │   └── index.ts
│   │
│   ├── download/                         # 下載服務
│   │   ├── download.service.ts           # Download Service
│   │   └── index.ts
│   │
│   ├── print/                            # 列印服務
│   │   ├── print.service.ts              # Print Service
│   │   └── index.ts
│   │
│   └── index.ts                          # Services 總匯出
│
├── models/                                # Shared Models (共享模型)
│   │
│   ├── common/                           # 通用模型
│   │   ├── pagination.model.ts           # Pagination Model
│   │   ├── sort.model.ts                 # Sort Model
│   │   ├── filter.model.ts               # Filter Model
│   │   ├── search.model.ts               # Search Model
│   │   ├── response.model.ts             # Response Model
│   │   └── index.ts
│   │
│   ├── ui/                               # UI 模型
│   │   ├── dialog-config.model.ts        # Dialog Config Model
│   │   ├── snackbar-config.model.ts      # Snackbar Config Model
│   │   ├── menu-item.model.ts            # Menu Item Model
│   │   ├── breadcrumb.model.ts           # Breadcrumb Model
│   │   ├── tab.model.ts                  # Tab Model
│   │   └── index.ts
│   │
│   ├── form/                             # Form 模型
│   │   ├── form-field-config.model.ts    # Form Field Config Model
│   │   ├── validation-error.model.ts     # Validation Error Model
│   │   └── index.ts
│   │
│   └── index.ts                          # Models 總匯出
│
├── utils/                                 # Shared Utilities (工具函數)
│   │
│   ├── array/                            # 陣列工具
│   │   ├── array.utils.ts                # Array Utilities
│   │   ├── sort.utils.ts                 # Sort Utilities
│   │   ├── group.utils.ts                # Group Utilities
│   │   └── index.ts
│   │
│   ├── string/                           # 字串工具
│   │   ├── string.utils.ts               # String Utilities
│   │   ├── slug.utils.ts                 # Slug Utilities
│   │   ├── truncate.utils.ts             # Truncate Utilities
│   │   └── index.ts
│   │
│   ├── date/                             # 日期工具
│   │   ├── date.utils.ts                 # Date Utilities
│   │   ├── date-format.utils.ts          # Date Format Utilities
│   │   ├── date-diff.utils.ts            # Date Diff Utilities
│   │   └── index.ts
│   │
│   ├── number/                           # 數字工具
│   │   ├── number.utils.ts               # Number Utilities
│   │   ├── currency.utils.ts             # Currency Utilities
│   │   ├── bytes.utils.ts                # Bytes Utilities
│   │   └── index.ts
│   │
│   ├── object/                           # 物件工具
│   │   ├── object.utils.ts               # Object Utilities
│   │   ├── deep-clone.utils.ts           # Deep Clone Utilities
│   │   ├── deep-merge.utils.ts           # Deep Merge Utilities
│   │   └── index.ts
│   │
│   ├── validation/                       # 驗證工具
│   │   ├── validation.utils.ts           # Validation Utilities
│   │   ├── email.utils.ts                # Email Validation Utilities
│   │   ├── url.utils.ts                  # URL Validation Utilities
│   │   └── index.ts
│   │
│   ├── color/                            # 顏色工具
│   │   ├── color.utils.ts                # Color Utilities
│   │   ├── hex-to-rgb.utils.ts           # Hex to RGB Utilities
│   │   └── index.ts
│   │
│   ├── file/                             # 檔案工具
│   │   ├── file.utils.ts                 # File Utilities
│   │   ├── file-size.utils.ts            # File Size Utilities
│   │   ├── mime-type.utils.ts            # MIME Type Utilities
│   │   └── index.ts
│   │
│   ├── dom/                              # DOM 工具
│   │   ├── dom.utils.ts                  # DOM Utilities
│   │   ├── scroll.utils.ts               # Scroll Utilities
│   │   └── index.ts
│   │
│   └── index.ts                          # Utils 總匯出
│
├── constants/                             # Shared Constants (共享常數)
│   │
│   ├── ui.constants.ts                   # UI 相關常數
│   ├── validation.constants.ts           # Validation 相關常數
│   ├── file.constants.ts                 # File 相關常數
│   ├── date.constants.ts                 # Date 相關常數
│   ├── breakpoints.constants.ts          # Breakpoints 常數
│   ├── animation.constants.ts            # Animation 常數
│   └── index.ts
│
├── enums/                                 # Shared Enums (共享列舉)
│   │
│   ├── file-type.enum.ts                 # File Type 列舉
│   ├── mime-type.enum.ts                 # MIME Type 列舉
│   ├── sort-direction.enum.ts            # Sort Direction 列舉
│   ├── date-format.enum.ts               # Date Format 列舉
│   └── index.ts
│
├── types/                                 # Shared Types (共享型別)
│   │
│   ├── common.types.ts                   # Common Types
│   ├── utility.types.ts                  # Utility Types
│   ├── callback.types.ts                 # Callback Types
│   └── index.ts
│
├── interfaces/                            # Shared Interfaces (共享介面)
│   │
│   ├── component.interface.ts            # Component Interfaces
│   ├── service.interface.ts              # Service Interfaces
│   ├── config.interface.ts               # Config Interfaces
│   └── index.ts
│
└── index.ts                               # Shared Layer 總匯出
```

---

## 關鍵設計原則 (Material Design 3 版本)

### 1. 組件分類原則

#### UI Components (基礎 UI 元件)
```
目的: 提供基礎的、可重用的 UI 元素
特點:
- 基於 Material Components 擴展
- 高度可配置
- 無業務邏輯
- 純展示組件

範例:
- Avatar: 顯示用戶頭像
- StatusChip: 顯示狀態標籤
- LoadingSpinner: 顯示載入動畫
```

#### Form Components (表單元件)
```
目的: 提供表單相關的輸入元件
特點:
- 支援 Reactive Forms
- 完整的驗證支援
- 無障礙設計
- Material Design 3 樣式

範例:
- Input: 文字輸入框
- Select: 下拉選單
- Datepicker: 日期選擇器
- FileUploader: 檔案上傳器
```

#### Data Display Components (資料展示元件)
```
目的: 展示和操作資料
特點:
- 支援大量資料
- 虛擬滾動
- 排序、篩選、分頁
- CDK 整合

範例:
- DataTable: 資料表格
- VirtualTable: 虛擬滾動表格
- Tree: 樹狀結構
- Timeline: 時間軸
```

#### Navigation Components (導航元件)
```
目的: 提供導航和路由功能
特點:
- 路由整合
- 響應式設計
- 無障礙支援

範例:
- Breadcrumb: 麵包屑
- Tabs: 標籤頁
- Menu: 選單
- BottomNav: 底部導航
```

#### Feedback Components (回饋元件)
```
目的: 提供用戶回饋和通知
特點:
- 非侵入式
- 可配置
- 無障礙支援

範例:
- Snackbar: 通知訊息
- ConfirmDialog: 確認對話框
- Tooltip: 提示框
```

---

### 2. 組件設計模式

#### Standalone Component Pattern
```typescript
// shared/components/ui/avatar/avatar.component.ts

/**
 * Avatar Component
 * 
 * 顯示用戶頭像,支援圖片、文字、圖示
 * 
 * 使用範例:
 * <app-avatar [user]="user" size="medium" />
 * <app-avatar [src]="imageUrl" size="large" />
 * <app-avatar [text]="initials" size="small" />
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  template: `
    <div 
      class="avatar" 
      [class]="'avatar--' + size()"
      [style.background-color]="backgroundColor()"
    >
      @if (src()) {
        <img [src]="src()" [alt]="alt()" />
      } @else if (text()) {
        <span class="avatar__text">{{ text() }}</span>
      } @else if (icon()) {
        <mat-icon>{{ icon() }}</mat-icon>
      } @else {
        <mat-icon>person</mat-icon>
      }
    </div>
  `,
  styles: [`
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
      
      &--small {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }
      
      &--medium {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
      
      &--large {
        width: 56px;
        height: 56px;
        font-size: 20px;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  
  // Inputs (Signal Inputs)
  user = input<User | null>(null);
  src = input<string | null>(null);
  text = input<string | null>(null);
  icon = input<string | null>(null);
  size = input<'small' | 'medium' | 'large'>('medium');
  alt = input<string>('Avatar');
  
  // Computed
  protected readonly backgroundColor = computed(() => {
    const user = this.user();
    if (!user) return undefined;
    
    // 根據用戶 ID 或名稱生成顏色
    return this.generateColor(user.id || user.name);
  });
  
  // Private Methods
  private generateColor(str: string): string {
    // 簡單的顏色生成邏輯
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
}
```

---

### 3. 指令設計模式

#### Permission Directive
```typescript
// shared/directives/access-control/has-permission.directive.ts

/**
 * Has Permission Directive
 * 
 * 根據權限控制元素的顯示
 * 
 * 使用範例:
 * <button appHasPermission="tasks:create">創建任務</button>
 * <div [appHasPermission]="['tasks:edit', 'tasks:delete']" [permissionOp]="'OR'">
 *   操作按鈕
 * </div>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  
  // Inject Dependencies
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef);
  private readonly permissionChecker = inject(PermissionCheckerService);
  
  // Inputs
  @Input({ required: true }) appHasPermission!: string | string[];
  @Input() permissionOp: 'AND' | 'OR' = 'AND';
  
  // State
  private hasView = false;
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // 訂閱權限變更
    this.permissionChecker.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
    
    // 初始檢查
    this.updateView();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateView(): void {
    const hasPermission = this.checkPermission();
    
    if (hasPermission && !this.hasView) {
      // 顯示元素
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      // 隱藏元素
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  
  private checkPermission(): boolean {
    const permissions = Array.isArray(this.appHasPermission)
      ? this.appHasPermission
      : [this.appHasPermission];
    
    if (this.permissionOp === 'AND') {
      return permissions.every(p => this.permissionChecker.hasPermission(p));
    } else {
      return permissions.some(p => this.permissionChecker.hasPermission(p));
    }
  }
}
```

---

### 4. Pipe 設計模式

#### Date Ago Pipe
```typescript
// shared/pipes/date/date-ago.pipe.ts

/**
 * Date Ago Pipe
 * 
 * 將日期轉換為相對時間 (例如: "3 分鐘前", "2 小時前")
 * 
 * 使用範例:
 * {{ date | dateAgo }}
 * {{ date | dateAgo: true }} // 顯示完整格式
 */
@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: true, // Pure pipe for performance
})
export class DateAgoPipe implements PipeTransform {
  
  transform(value: Date | string | number | null | undefined, full: boolean = false): string {
    if (!value) return '';
    
    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 0) {
      return '未來';
    }
    
    const intervals: { [key: string]: number } = {
      年: 31536000,
      月: 2592000,
      週: 604800,
      天: 86400,
      小時: 3600,
      分鐘: 60,
      秒: 1,
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        if (full) {
          return `${interval} ${unit}前`;
        } else {
          // 簡短格式
          if (unit === '年') return `${interval}年前`;
          if (unit === '月') return `${interval}個月前`;
          if (unit === '週') return `${interval}週前`;
          if (unit === '天') return `${interval}天前`;
          if (unit === '小時') return `${interval}小時前`;
          if (unit === '分鐘') return `${interval}分鐘前`;
          return '剛剛';
        }
      }
    }
    
    return '剛剛';
  }
}
```

---

### 5. Validator 設計模式

#### Async Validator (Unique Email)
```typescript
// shared/validators/async/unique-email.validator.ts

/**
 * Unique Email Validator (Async)
 * 
 * 驗證 Email 是否已被使用
 * 
 * 使用範例:
 * email: ['', [Validators.required, Validators.email], [uniqueEmailValidator()]]
 */
export function uniqueEmailValidator(): AsyncValidatorFn {
  
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    
    if (!control.value) {
      return of(null);
    }
    
    // Inject Service (需要在使用時提供 Injector)
    const injector = inject(Injector);
    const accountRepository = injector.get(IAccountRepository);
    
    return timer(300).pipe(
      switchMap(() => accountRepository.checkEmailExists(control.value)),
      map(exists => exists ? { uniqueEmail: { value: control.value } } : null),
      catchError(() => of(null))
    );
  };
}
```

---

### 6. Service 設計模式

#### Dialog Service (封裝 MatDialog)
```typescript
// shared/services/dialog/dialog.service.ts

/**
 * Dialog Service
 * 
 * 封裝 MatDialog,提供更簡潔的 API
 * 
 * 使用範例:
 * const result = await this.dialogService.confirm({
 *   title: '確認刪除',
 *   message: '確定要刪除此項目嗎?',
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  
  private readonly dialog = inject(MatDialog);
  
  /**
   * 打開確認對話框
   */
  confirm(config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Observable<boolean> {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || '確認',
        cancelText: config.cancelText || '取消',
      },
    });
    
    return dialogRef.afterClosed().pipe(
      map(result => result === true)
    );
  }
  
  /**
   * 打開警告對話框
   */
  alert(config: {
    title: string;
    message: string;
    okText?: string;
  }): Observable<void> {
    
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title: config.title,
        message: config.message,
        okText: config.okText || '確定',
      },
    });
    
    return dialogRef.afterClosed().pipe(
      map(() => undefined)
    );
  }
  
  /**
   * 打開自定義對話框
   */
  open<T, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<any>
  ): Observable<R | undefined> {
    
    const dialogRef = this.dialog.open<T, any, R>(component, config);
    
    return dialogRef.afterClosed();
  }
}
```

---

### 7. 工具函數設計模式

#### Array Utilities
```typescript
// shared/utils/array/array.utils.ts

/**
 * Array Utilities
 * 
 * 提供陣列操作的工具函數
 */

/**
 * 根據屬性對陣列去重
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 根據屬性分組
 */
export function groupBy<T>(array: T[], key: keyof T): Map<any, T[]> {
  return array.reduce((map, item) => {
    const groupKey = item[key];
    const group = map.get(groupKey) || [];
    group.push(item);
    map.set(groupKey, group);
    return map;
  }, new Map<any, T[]>());
}

/**
 * 分塊 (Chunk)
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 打亂順序 (Shuffle)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 提取屬性值
 */
export function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map(item => item[key]);
}
```

---

## Copilot 友善的命名檢查清單

### ✅ Component 命名檢查
- [ ] UI Components 在 `shared/components/ui/`
- [ ] Form Components 在 `shared/components/form/`
- [ ] Data Display Components 在 `shared/components/data-display/`
- [ ] Navigation Components 在 `shared/components/navigation/`
- [ ] Feedback Components 在 `shared/components/feedback/`
- [ ] 每個組件都有自己的資料夾
- [ ] 使用 kebab-case 命名

### ✅ Directive 命名檢查
- [ ] 使用 `app` 前綴 (例: `appHasPermission`)
- [ ] 檔名使用 `.directive.ts` 後綴
- [ ] 按功能分類在不同資料夾

### ✅ Pipe 命名檢查
- [ ] 使用 camelCase 命名 (例: `dateAgo`)
- [ ] 檔名使用 `.pipe.ts` 後綴
- [ ] 按功能分類在不同資料夾

### ✅ Validator 命名檢查
- [ ] 同步驗證器在 `validators/sync/`
- [ ] 非同步驗證器在 `validators/async/`
- [ ] 檔名使用 `.validator.ts` 後綴

### ✅ Service 命名檢查
- [ ] 檔名使用 `.service.ts` 後綴
- [ ] 提供在 `providedIn: 'root'`
- [ ] 按功能分類在不同資料夾

### ✅ Utility 命名檢查
- [ ] 檔名使用 `.utils.ts` 後綴
- [ ] 按功能分類在不同資料夾
- [ ] 匯出純函數

---

## 開發順序建議

1. **Constants & Enums** (constants/, enums/)
   - 定義常數和列舉

2. **Models & Types** (models/, types/, interfaces/)
   - 定義共享資料模型

3. **Utilities** (utils/)
   - 實作工具函數
   - 從簡單到複雜

4. **Pipes** (pipes/)
   - 實作管道
   - 從常用到少用

5. **Validators** (validators/)
   - 實作同步驗證器
   - 實作非同步驗證器

6. **Directives** (directives/)
   - 實作指令
   - 測試指令功能

7. **Services** (services/)
   - 實作服務
   - 封裝第三方服務

8. **UI Components** (components/ui/)
   - Avatar, Button, Chip 等基礎組件
   - 從簡單到複雜

9. **Form Components** (components/form/)
   - Input, Select, Datepicker 等表單組件
   - 整合驗證器

10. **Data Display Components** (components/data-display/)
    - DataTable, Tree, Timeline 等
    - CDK 整合

11. **Navigation Components** (components/navigation/)
    - Breadcrumb, Tabs, Menu 等

12. **Feedback Components** (components/feedback/)
    - Snackbar, Dialog, Tooltip 等

13. **Layout Components** (components/layout/)
    - Container, Grid, Flex 等

14. **Media Components** (components/media/)
    - Image, ImageViewer, VideoPlayer 等

15. **Chart Components** (components/charts/)
    - LineChart, BarChart, PieChart 等

這樣的順序可以確保:
- 基礎先建立
- 依賴關係正確
- 可以逐步測試
- 複雜組件可以使用基礎組件