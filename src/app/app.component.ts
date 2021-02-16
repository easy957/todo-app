import { Component, OnInit } from '@angular/core';
import { Priority } from 'src/app/model/priority';
import { Category } from './model/category';
import { Task } from './model/task';
import { DataHandlerService } from './service/data-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'my-app';
  public tasks!: Task[];
  public categories!: Category[];
  public priorities!: Priority[];

  public selectedCategory: Category | undefined = undefined;

  public searchCategoryText = '';

  public searchTaskText = '';
  public statusFilter: boolean | undefined;
  public priorityFilter: Priority | undefined;

  constructor(private dataHandler: DataHandlerService) {}

  ngOnInit(): void {
    // this.dataHandler.getAllTasks().subscribe((tasks) => (this.tasks = tasks));
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.dataHandler
      .getAllPriorities()
      .subscribe((priorities) => (this.priorities = priorities));
    this.onSelectCategory(undefined);
  }

  public onSelectCategory(category: Category | undefined): void {
    this.selectedCategory = category;

    this.updateTasks();
  }

  public onAddCategory(category: Category): void {
    this.dataHandler.addCategory(category).subscribe(() => {
      this.updateCategories();
    });
  }

  public onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category.id).subscribe(() => {
      this.selectedCategory = undefined;
      this.onSelectCategory(undefined);
    });
  }

  public onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category).subscribe(() => {
      this.onSearchCategory(this.searchCategoryText);
    });
  }

  public onSearchCategory(title: string): void {
    this.searchCategoryText = title;

    this.dataHandler.searchCategories(title).subscribe((categories) => {
      this.categories = categories;
    });
  }

  public onAddTask(task: Task): void {
    this.dataHandler.addTask(task).subscribe(() => {
      this.updateTasks();
    });
  }

  public onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.updateTasks();
    });
  }

  public onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasks();
    });
  }

  public onSearchTasks(searchString: string): void {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  public onFilterTasksByStatus(status: boolean | undefined): void {
    this.statusFilter = status;
    this.updateTasks();
  }

  public onFilterTasksByPriority(priority: Priority | undefined): void {
    this.priorityFilter = priority;
    this.updateTasks();
  }

  private updateTasks(): void {
    this.dataHandler
      .searchTasks(
        this.selectedCategory,
        this.searchTaskText,
        this.statusFilter,
        this.priorityFilter
      )
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      });
  }

  private updateCategories(): void {
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
  }
}
