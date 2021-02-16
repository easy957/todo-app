import { PriorityDAOArray } from './../data/dao/impl/priorityDAOArray';
import { Priority } from 'src/app/model/priority';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { CategoryDAOArray } from './../data/dao/impl/categoryDAOArray';
import { TaskDAOArray } from './../data/dao/impl/taskDAOArray';
import { Category } from './../model/category';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService {
  // tasksSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  // categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);
  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor() {}

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryDaoArray.getAll();
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.priorityDaoArray.getAll();
  }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.taskDaoArray.delete(id);
  }

  searchTasks(
    category?: Category | undefined,
    searchText?: string,
    status?: boolean | undefined,
    priority?: Priority | undefined
  ): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

  searchCategories(title: string): Observable<Category[]> {
    return this.categoryDaoArray.search(title);
  }

  addCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.add(category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.update(category);
  }

  deleteCategory(id: number): Observable<Category> {
    return this.categoryDaoArray.delete(id);
  }

  getCompletedCountInCategory(
    category: Category | undefined
  ): Observable<number> {
    return this.taskDaoArray.getCompletedCountInCategory(category);
  }
  getUncompletedCountInCategory(
    category: Category | undefined
  ): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(category);
  }
  getUncompletedTotalCount(): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(undefined);
  }
  getTotalCountInCategory(category: Category | undefined): Observable<number> {
    return this.taskDaoArray.getTotalCountInCategory(category);
  }
}
