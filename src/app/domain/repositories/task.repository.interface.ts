/**
 * TaskRepository contract for task-related data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Task, TaskFilter, Workflow } from '../tasks';

export interface TaskRepository {
  /**
   * Get all tasks for a workspace with optional filtering
   */
  getTasks(workspaceId: string, filter?: TaskFilter): Promise<Task[]>;
  
  /**
   * Get a single task by ID
   */
  getTask(id: string): Promise<Task | null>;
  
  /**
   * Get all workflows for a workspace
   */
  getWorkflows(workspaceId: string): Promise<Workflow[]>;
  
  /**
   * Create a new task
   */
  createTask(task: Omit<Task, 'id'>): Promise<string>;
  
  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: Task['status']): Promise<void>;
  
  /**
   * Update task data
   */
  updateTask(taskId: string, updates: Partial<Task>): Promise<void>;
  
  /**
   * Delete a task, optionally cascading to children
   */
  deleteTask(taskId: string, cascadeChildren?: boolean): Promise<void>;
  
  /**
   * Reorder tasks
   */
  reorderTasks(tasks: { id: string; order: number }[]): Promise<void>;
}
