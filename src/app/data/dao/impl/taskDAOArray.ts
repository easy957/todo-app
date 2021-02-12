import { TestData } from './../../testData';
import { Observable, of } from 'rxjs';
import { Category } from 'src/app/model/category';
import { Priority } from 'src/app/model/priority';
import { Task } from 'src/app/model/task';
import { TaskDAO } from './../interface/taskDAO';

export class TaskDAOArray implements TaskDAO {

  getAll(): Observable<Task[]> {
    return of(TestData.tasks);
  }

  get(id: number): Observable<Task> {
    throw new Error('Method not implemented.');
    // return of(TestData.tasks.find(todo => todo.id === id));
  }

  search(
    category: (Category | null),
    searchText: (string | null),
    status: (boolean | null),
    priority: (Priority | null)): Observable<Task[]> {
    return of(this.searchTodos(category, searchText, status, priority));
  }

  private searchTodos(
    category: (Category | null),
    searchText: (string | null),
    status: (boolean | null),
    priority: (Priority | null)): Task[] {
    let allTasks: Task[] = TestData.tasks;

    if (category != null) {
      allTasks = allTasks.filter(todo => todo.category === category);
    }

    return allTasks;
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    throw new Error('Method not implemented.');
  }
  getUncompletedCountInCategory(category: Category): Observable<number> {
    throw new Error('Method not implemented.');
  }
  getTotalCountInCategory(category: Category): Observable<number> {
    throw new Error('Method not implemented.');
  }
  getTotalCount(): Observable<number> {
    throw new Error('Method not implemented.');
  }
  add(T: Task): Observable<Task> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Observable<Task> {
    throw new Error('Method not implemented.');
  }
  update(task: Task): Observable<Task> {

    // tslint:disable-next-line: no-non-null-assertion
    const taskTmp: Task = TestData.tasks.find(t => t.id === task.id)!;
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);

    return of(task);
  }

}
