import { Category } from './category';
import { Priority } from './priority';

export class Task {
  id: number;
  title: string;
  completed: boolean;
  priority?: Priority;
  category?: Category | undefined;
  date?: Date;

  constructor(
    id: number,
    title: string,
    completed: boolean,
    priority?: Priority,
    category?: Category | undefined,
    date?: Date
  ) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.date = date;
  }
}
