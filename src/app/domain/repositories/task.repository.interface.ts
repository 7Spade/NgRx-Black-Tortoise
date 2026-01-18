/**
 * TaskRepository contract for task-related data access.
 */
import { Observable } from 'rxjs';
import { Task, TaskFilter, Workflow } from '../tasks';

export interface TaskRepository {
  getTasks(workspaceId: string, filter?: TaskFilter): Observable<Task[]>;
  getTask(id: string): Observable<Task | null>;
  getWorkflows(workspaceId: string): Observable<Workflow[]>;
  createTask(task: Omit<Task, 'id'>): Observable<string>;
  updateTaskStatus(taskId: string, status: Task['status']): Observable<void>;
  updateTask(taskId: string, updates: Partial<Task>): Observable<void>;
  deleteTask(taskId: string, cascadeChildren?: boolean): Observable<void>;
  reorderTasks(tasks: { id: string; order: number }[]): Observable<void>;
}
