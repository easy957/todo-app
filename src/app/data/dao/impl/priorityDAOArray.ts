import { TestData } from './../../testData';
import { Observable } from 'rxjs';
import { Priority } from 'src/app/model/priority';
import { PriorityDAO } from '../interface/priorityDAO';
import { of } from 'rxjs';

export class PriorityDAOArray implements PriorityDAO {
  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  add(priority: Priority): Observable<Priority> {
    if (priority.id === 0) {
      priority.id = this.getLastIdPriority();
    }
    TestData.priorities.push(priority);
    return of(priority);
  }

  private getLastIdPriority(): number {
    return (
      Math.max.apply(
        Math,
        TestData.priorities.map((priority) => priority.id)
      ) + 1
    );
  }

  get(id: number): Observable<Priority> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<Priority> {
    TestData.tasks.forEach((task) => {
      if (task.priority && task.priority.id === id) {
        task.priority = undefined;
      }
    });

    const tmpPriority: Priority = TestData.priorities.find(
      (t) => t.id === id
    ) as Priority;
    TestData.priorities.splice(TestData.priorities.indexOf(tmpPriority), 1);

    return of(tmpPriority);
  }
  update(priority: Priority): Observable<Priority> {
    const tmpPriority: Priority = TestData.priorities.find(
      (t) => t.id === priority.id
    ) as Priority;
    TestData.priorities.splice(
      TestData.priorities.indexOf(tmpPriority),
      1,
      priority
    );

    return of(tmpPriority);
  }
}
