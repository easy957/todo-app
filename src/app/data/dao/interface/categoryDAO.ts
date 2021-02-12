import { Observable } from 'rxjs';
import { Category } from './../../../model/category';
import { CommonDAO } from './commonDAO';

export interface CategoryDAO extends CommonDAO<Category> {

  search(title: string): Observable<Category[]>;

}
