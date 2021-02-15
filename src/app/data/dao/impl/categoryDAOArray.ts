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
    TestData.tasks.forEach(task => {
      if (task.category && task.category.id === id) {
        task.category = undefined;
      }
    });

    const tmpCategory: Category = TestData.categories.find(t => t.id === id) as (Category);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1);

    return of(tmpCategory);
  }

  update(category: Category): Observable<Category> {
    const tmpCategory: Category = TestData.categories.find(t => t.id === category.id) as (Category);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1, category);

    return of(tmpCategory);
  }

}
