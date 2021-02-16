import { Priority } from 'src/app/model/priority';
import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from './service/data-handler.service';
import { Category } from './model/category';
import { Task } from './model/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';
  tasks!: Task[];
  categories!: Category[];
  priorities!: Priority[];

  public selectedCategory!: Category | undefined;

  public searchCategoryText = '';

  public searchTaskText = '';
  public statusFilter: boolean | undefined;
  public priorityFilter: Priority | undefined;

  constructor(private dataHandler: DataHandlerService) {}

  ngOnInit(): void {
    this.onSelectCategory(undefined);
    // this.dataHandler.getAllTasks().subscribe((tasks) => (this.tasks = tasks));
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.dataHandler
      .getAllPriorities()
      .subscribe((priorities) => (this.priorities = priorities));
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
      this.onSelectCategory(this.selectedCategory);
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
      this.dataHandler
        .searchTasks(
          this.selectedCategory,
          this.searchTaskText,
          this.statusFilter,
          this.priorityFilter
        )
        .subscribe((tasks) => {
          this.tasks = tasks;
        });
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
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }

  private updateCategories(): void {
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
  }
}
