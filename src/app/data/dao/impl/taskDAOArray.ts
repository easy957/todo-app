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
    category?: Category | undefined,
    searchText?: string,
    status?: boolean | undefined,
    priority?: Priority | undefined
  ): Observable<Task[]> {
    return of(this.searchTasks(category, searchText, status, priority));
  }

  private searchTasks(
    category?: Category | undefined,
    searchText?: string,
    status?: boolean | undefined,
    priority?: Priority | undefined
  ): Task[] {
    let allTasks: Task[] = TestData.tasks;

    if (status !== undefined) {
      allTasks = allTasks.filter((task) => task.completed === status);
    }

    if (category !== undefined) {
      allTasks = allTasks.filter((task) => task.category === category);
    }

    if (priority !== undefined) {
      allTasks = allTasks.filter((task) => task.priority === priority);
    }

    if (searchText !== undefined) {
      allTasks = allTasks.filter((task) => {
        return task.title.toUpperCase().includes(searchText.toUpperCase());
      });
    }

    return allTasks;
  }

  getCompletedCountInCategory(
    category: Category | undefined
  ): Observable<number> {
    return of(this.searchTasks(category, undefined, true, undefined).length);
  }
  getUncompletedCountInCategory(
    category: Category | undefined
  ): Observable<number> {
    return of(this.searchTasks(category, undefined, false, undefined).length);
  }
  getTotalCountInCategory(category: Category | undefined): Observable<number> {
    return of(
      this.searchTasks(category, undefined, undefined, undefined).length
    );
  }
  getTotalCount(): Observable<number> {
    return of(TestData.tasks.length);
  }

  add(task: Task): Observable<Task> {
    if (task.id === 0) {
      task.id = this.getLastIdTask();
    }
    TestData.tasks.push(task);
    return of(task);
  }

  private getLastIdTask(): number {
    return (
      Math.max.apply(
        Math,
        TestData.tasks.map((task) => task.id)
      ) + 1
    );
  }

  delete(id: number): Observable<Task> {
    const taskTmp: Task = TestData.tasks.find((t) => t.id === id) as Task;
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1);
    return of(taskTmp);
  }

  update(task: Task): Observable<Task> {
    const taskTmp: Task = TestData.tasks.find((t) => t.id === task.id) as Task;
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);

    return of(task);
  }
}
