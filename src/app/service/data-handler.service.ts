import { Injectable } from '@angular/core';

import { Category } from './../model/category';
import { TestData } from '../data/testData';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

constructor() { }

  getCategories(): Category[] {
    return TestData.categories;
  }

  getTasks(): Task[] {
    return TestData.tasks;
  }

  getTasksByCategory(category: Category): Task[] {
    const filteredTasks = TestData.tasks.filter(task => task.category === category);
    console.log(filteredTasks);

    return filteredTasks;
  }

}
