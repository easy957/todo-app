import { TestData } from './../../testData';
import { Observable } from 'rxjs';
import { Priority } from 'src/app/model/priority';
import { PriorityDAO } from '../interface/priorityDAO';
import { of } from 'rxjs';

export class PriorityDAOArray implements PriorityDAO {

  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  add(T: Priority): Observable<Priority> {
    throw new Error('Method not implemented.');
  }
  get(id: number): Observable<Priority> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Observable<Priority> {
    throw new Error('Method not implemented.');
  }
  update(T: Priority): Observable<Priority> {
    throw new Error('Method not implemented.');
  }

}
