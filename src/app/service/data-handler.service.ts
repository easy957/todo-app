import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { CategoryDAOArray } from './../data/dao/impl/categoryDAOArray';
import { TaskDAOArray } from './../data/dao/impl/taskDAOArray';
import { Category } from './../model/category';
import { Task } from '../model/task';

import { Priority } from '../model/priority';

@Injectable({
  providedIn: 'root'
})

export class DataHandlerService {

  // tasksSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  // categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);
  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();

  constructor() { }

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryDaoArray.getAll();
  }

  searchTasks(
    category: (Category | null),
    searchText: (string | null),
    status: (boolean | null),
    priority: (Priority | null)): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

  // fillTasks(): void {
  //   this.tasksSubject.next(TestData.tasks);
  // }

  // fillTasksByCategory(category: Category): void {
  //   const filteredTasks = TestData.tasks.filter(task => task.category === category);
  //   this.tasksSubject.next(filteredTasks);
  // }

}
