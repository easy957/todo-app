import { Observable } from 'rxjs';
import { CommonDAO } from './commonDAO';
import { Task } from 'src/app/model/task';
import { Priority } from 'src/app/model/priority';
import { Category } from 'src/app/model/category';

export interface TaskDAO extends CommonDAO<Task> {

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]>;

  getCompletedCountInCategory(category: Category): Observable<number>;

  getUncompletedCountInCategory(category: Category): Observable<number>;

  getTotalCountInCategory(category: Category): Observable<number>;

  getTotalCount(): Observable<number>;
}
