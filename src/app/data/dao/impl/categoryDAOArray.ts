import { TestData } from './../../testData';
import { Observable, of } from 'rxjs';
import { Category } from 'src/app/model/category';
import { CategoryDAO } from './../interface/categoryDAO';

export class CategoryDAOArray implements CategoryDAO {

  getAll(): Observable<Category[]> {
    return of(TestData.categories);
  }

  search(title: string): Observable<Category[]> {
    throw new Error('Method not implemented.');
  }
  add(T: Category): Observable<Category> {
    throw new Error('Method not implemented.');
  }
  get(id: number): Observable<Category> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Observable<Category> {
    throw new Error('Method not implemented.');
  }
  update(T: Category): Observable<Category> {
    throw new Error('Method not implemented.');
  }

}
