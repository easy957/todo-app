import { IntroService } from './service/intro.service';
import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { Priority } from 'src/app/model/priority';
import { Category } from './model/category';
import { Task } from './model/task';
import { DataHandlerService } from './service/data-handler.service';
import { concatMap, map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  public categoryMap = new Map<Category, number>();

  public totalTasksCountInCategory!: number;
  public completedCountInCategory!: number;
  public uncompletedCountInCategory!: number;
  public uncompletedTotalTasksCount!: number;

  public statShown = true;

  //  ------ МЕНЮ ----------
  public menuOpened!: boolean;
  public menuMode!: 'over' | 'push' | 'slide';
  public menuPosition!: 'start' | 'end' | 'left' | 'right' | 'top' | 'bottom';
  public showBackdrop!: boolean;

  private isMobile!: boolean;
  private isTablet!: boolean;

  constructor(
    private dataHandler: DataHandlerService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    //  Проверка типа устройства пользователя
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.statShown = true ? !this.isMobile : false;
    this.setMenuValues();
  }

  ngOnInit(): void {
    this.dataHandler
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
    this.dataHandler
      .getAllPriorities()
      .subscribe((priorities) => (this.priorities = priorities));
    this.fillCategories();
    this.onSelectCategory(undefined);
  }

  public onToggleStat(stat: boolean): void {
    this.statShown = stat;
  }

  public onToggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  public onClosedMenu(): void {
    this.menuOpened = false;
  }

  private setMenuValues(): void {
    this.menuPosition = 'left';

    if (this.isMobile) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.showBackdrop = true;
    } else if (this.isTablet) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.showBackdrop = true;
    } else {
      this.menuOpened = true;
      this.menuMode = 'push';
      this.showBackdrop = false;
    }
  }

  // --------------------------------
  // -----------РАБОТА С КАТЕГОРИЯМИ---------------------
  // --------------------------------

  private fillCategories(): void {
    if (this.categoryMap) {
      this.categoryMap.clear();
    }

    this.categories = this.categories.sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    this.categories.forEach((cat) => {
      this.dataHandler
        .getUncompletedCountInCategory(cat)
        .subscribe((count) => this.categoryMap.set(cat, count));
    });
  }

  public onSelectCategory(category: Category | undefined): void {
    this.selectedCategory = category;

    this.updateTasksAndStat();
  }

  public onAddCategory(category: Category): void {
    this.dataHandler.addCategory(category).subscribe(() => {
      this.fillCategories();
    });
  }

  public onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category.id).subscribe((cat) => {
      this.selectedCategory = undefined;
      this.categoryMap.delete(cat);
      this.onSearchCategory(this.searchCategoryText);
      this.updateTasks();
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

  // --------------------------------
  // ----------РАБОТА С ЗАДАЧАМИ----------------------
  // --------------------------------

  public onAddTask(task: Task): void {
    this.dataHandler
      .addTask(task)
      .pipe(
        concatMap((T) => {
          return this.dataHandler
            .getUncompletedCountInCategory(T.category)
            .pipe(
              map((count) => {
                return { t: T, count };
              })
            );
        })
      )
      .subscribe((result) => {
        const t = result.t as Task;
        if (t.category) {
          this.categoryMap.set(t.category as Category, result.count);
        }
        this.updateTasksAndStat();
      });
  }

  public onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.fillCategories();
      this.updateTasksAndStat();
    });
  }

  public onDeleteTask(task: Task): void {
    this.dataHandler
      .deleteTask(task.id)
      .pipe(
        concatMap((T) => {
          return this.dataHandler
            .getUncompletedCountInCategory(T.category)
            .pipe(
              map((count) => {
                return { t: T, count };
              })
            );
        })
      )
      .subscribe((result) => {
        const t = result.t as Task;
        if (t.category) {
          this.categoryMap.set(t.category as Category, result.count);
        }
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

  // --------------------------------
  // ----------ОБНОВЛЕНИЕ ДАННЫХ----------------------
  // --------------------------------

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

  // private updateCategories(): void {
  //   this.dataHandler
  //     .getAllCategories()
  //     .subscribe((categories) => (this.categories = categories));
  // }

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
