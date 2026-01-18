/**
 * ModuleRepository contract for module data access.
 */
import { Observable } from 'rxjs';
import { Module, ModuleConfig, ModuleType } from '../module/entities/module.entity';

export interface ModuleRepository {
  /**
   * 獲取工作區的所有模組
   */
  getWorkspaceModules(workspaceId: string): Observable<Module[]>;
  
  /**
   * 獲取單個模組
   */
  getModule(id: string): Observable<Module | null>;
  
  /**
   * 創建模組
   */
  createModule(module: Omit<Module, 'id'>): Observable<string>;
  
  /**
   * 更新模組
   */
  updateModule(id: string, data: Partial<Module>): Observable<void>;
  
  /**
   * 刪除模組
   */
  deleteModule(id: string): Observable<void>;
  
  /**
   * 批量更新模組順序
   */
  updateModuleOrder(workspaceId: string, moduleOrders: { id: string; order: number }[]): Observable<void>;
  
  /**
   * 啟用/停用模組
   */
  toggleModuleEnabled(id: string, enabled: boolean): Observable<void>;
  
  /**
   * 初始化工作區預設模組
   */
  initializeDefaultModules(workspaceId: string): Observable<Module[]>;
}
