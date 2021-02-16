import { Component, OnInit } from '@angular/core';
import { zip, of } from 'rxjs';
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

  public searchTaskText = '';
  public searchCategoryText = '';

  public priorityFilter: Priority | undefined;
  public statusFilter: boolean | undefined;

  public totalTasksCountInCategory!: number;
  public completedCountInCategory!: number;
  public uncompletedCountInCategory!: number;
  public uncompletedTotalTasksCount!: number;

  public statShown = true;

  constructor(private dataHandler: DataHandlerService) {}

  ngOnInit(): void {
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.dataHandler
      .getAllPriorities()
      .subscribe((priorities) => (this.priorities = priorities));
    this.onSelectCategory(undefined);
  }

  public onToggleStat(stat: boolean): void {
    this.statShown = stat;
  }

  public onSelectCategory(category: Category | undefined): void {
    this.selectedCategory = category;

    this.updateTasksAndStat();
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
      this.updateTasksAndStat();
    });
  }

  public onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.updateTasksAndStat();
    });
  }

  public onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasksAndStat();
    });
  }

  public onSearchTasks(searchString: string): void {
    this.searchTaskText = searchString;
    this.updateTasksAndStat();
  }

  public onFilterTasksByStatus(status: boolean | undefined): void {
    this.statusFilter = status;
    this.updateTasksAndStat();
  }

  public onFilterTasksByPriority(priority: Priority | undefined): void {
    this.priorityFilter = priority;
    this.updateTasksAndStat();
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

  private updateTasksAndStat(): void {
    this.updateTasks();
    this.updateStat();
  }

  private updateStat(): void {
    zip(
      this.dataHandler.getTotalCountInCategory(this.selectedCategory),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedTotalCount()
    ).subscribe((array) => {
      this.totalTasksCountInCategory = array[0] as number;
      this.completedCountInCategory = array[1] as number;
      this.uncompletedCountInCategory = array[2] as number;
      this.uncompletedTotalTasksCount = array[3] as number;
    });
  }
}
