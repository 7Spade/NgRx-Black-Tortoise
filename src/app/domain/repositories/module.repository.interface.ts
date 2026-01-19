/**
 * ModuleRepository contract for module data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Module, ModuleType } from '../module/entities/module.entity';

export interface ModuleRepository {
  /**
   * 獲取工作區的所有模組
   */
  getWorkspaceModules(workspaceId: string): Promise<Module[]>;
  
  /**
   * 獲取單個模組
   */
  getModule(id: string): Promise<Module | null>;
  
  /**
   * 創建模組
   */
  createModule(module: Omit<Module, 'id'>): Promise<string>;
  
  /**
   * 更新模組
   */
  updateModule(id: string, data: Partial<Module>): Promise<void>;
  
  /**
   * 刪除模組
   */
  deleteModule(id: string): Promise<void>;
  
  /**
   * 批量更新模組順序
   */
  updateModuleOrder(workspaceId: string, moduleOrders: { id: string; order: number }[]): Promise<void>;
  
  /**
   * 啟用/停用模組
   */
  toggleModuleEnabled(id: string, enabled: boolean): Promise<void>;
  
  /**
   * 初始化工作區預設模組
   */
  initializeDefaultModules(workspaceId: string): Promise<Module[]>;
}
