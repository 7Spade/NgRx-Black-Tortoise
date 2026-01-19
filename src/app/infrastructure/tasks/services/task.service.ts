/**
 * Task Service - Firestore integration for tasks
 * Promise-based implementation for framework-agnostic domain layer
 * PRD: @angular/fire/firestore (Transaction | Batch | Query)
 */

import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  runTransaction,
  query,
  where,
  orderBy,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  getDocs
} from '@angular/fire/firestore';
import { Task, Workflow, TaskFilter } from '@domain/tasks';
import { TaskRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class TaskService implements TaskRepository {
  private firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');
  private workflowsCollection = collection(this.firestore, 'workflows');

  /**
   * Get all tasks for a workspace
   */
  async getTasks(workspaceId: string, filter?: TaskFilter): Promise<Task[]> {
    const constraints: QueryConstraint[] = [
      where('workspaceId', '==', workspaceId),
    ];

    if (filter?.status && filter.status.length > 0) {
      constraints.push(where('status', 'in', filter.status));
    }

    if (filter?.priority && filter.priority.length > 0) {
      constraints.push(where('priority', 'in', filter.priority));
    }

    if (filter?.assigneeId) {
      constraints.push(where('assigneeId', '==', filter.assigneeId));
    }

    if (filter?.workflowId) {
      constraints.push(where('workflowId', '==', filter.workflowId));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(this.tasksCollection, ...constraints);

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.convertTimestamps({ ...doc.data(), id: doc.id }) as Task);
  }

  /**
   * Get single task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    const taskDoc = doc(this.tasksCollection, id);
    const snapshot = await getDocs(query(collection(this.firestore, 'tasks'), where('__name__', '==', id)));
    if (snapshot.empty) {
      return null;
    }
    const data = snapshot.docs[0]?.data();
    if (!data) {
      return null;
    }
    return this.convertTimestamps({ ...data, id }) as Task;
  }

  /**
   * Get all workflows for a workspace
   */
  async getWorkflows(workspaceId: string): Promise<Workflow[]> {
    const q = query(
      this.workflowsCollection,
      where('workspaceId', '==', workspaceId),
      orderBy('name', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.convertTimestamps({ ...doc.data(), id: doc.id }) as Workflow);
  }

  /**
   * Create a new task
   */
  async createTask(task: Omit<Task, 'id'>): Promise<string> {
    const taskData = {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.tasksCollection, taskData);
    return docRef.id;
  }

  /**
   * Update task status using Firestore transaction
   * Ensures atomic updates for progress calculations
   */
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const taskDoc = doc(this.tasksCollection, taskId);

    await runTransaction(this.firestore, async (transaction) => {
      const taskSnapshot = await transaction.get(taskDoc);
      if (!taskSnapshot.exists()) {
        throw new Error('Task not found');
      }

      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (status === 'done') {
        updateData.completedDate = serverTimestamp();
        updateData.progress = 100;
      }

      transaction.update(taskDoc, updateData);
    });
  }

  /**
   * Update task details
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskDoc = doc(this.tasksCollection, taskId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(taskDoc, updateData);
  }

  /**
   * Delete task (with cascade for subtasks using batch)
   */
  async deleteTask(taskId: string, cascadeChildren = true): Promise<void> {
    if (!cascadeChildren) {
      const taskDoc = doc(this.tasksCollection, taskId);
      await deleteDoc(taskDoc);
      return;
    }

    // Get all child tasks and delete in batch
    const childQuery = query(
      this.tasksCollection,
      where('parentId', '==', taskId)
    );

    const snapshot = await getDocs(childQuery);
    const batch = writeBatch(this.firestore);
    const taskDoc = doc(this.tasksCollection, taskId);
    batch.delete(taskDoc);

    snapshot.docs.forEach(childDoc => {
      batch.delete(childDoc.ref);
    });

    await batch.commit();
  }

  /**
   * Reorder tasks using batch update
   */
  async reorderTasks(tasks: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    tasks.forEach(({ id, order }) => {
      const taskDoc = doc(this.tasksCollection, id);
      batch.update(taskDoc, { order, updatedAt: serverTimestamp() });
    });

    await batch.commit();
  }

  /**
   * Convert Firestore Timestamps to Date objects
   */
  private convertTimestamps(data: any): any {
    const result = { ...data };

    ['createdAt', 'updatedAt', 'startDate', 'dueDate', 'completedDate'].forEach(
      (field) => {
        if (result[field] instanceof Timestamp) {
          result[field] = result[field].toDate();
        }
      }
    );

    return result;
  }
}
