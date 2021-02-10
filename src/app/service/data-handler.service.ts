import { Injectable } from '@angular/core';

import { Category } from './../model/category';
import { TestData } from '../data/testData';
import { Task } from '../model/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  tasksSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);

  constructor() { }

  // fillCategories(): Category[] {
  //   return TestData.categories;
  // }

  fillTasks(): void {
    this.tasksSubject.next(TestData.tasks);
  }

  fillTasksByCategory(category: Category): void {
    const filteredTasks = TestData.tasks.filter(task => task.category === category);
    this.tasksSubject.next(filteredTasks);
  }

}
