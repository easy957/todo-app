import { Priority } from 'src/app/model/priority';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Category } from './../../model/category';
import { ConfirmDialogComponent } from './../../dialog/confirmDialog/confirmDialog.component';
import { DataHandlerService } from '../../service/data-handler.service';
import { Task } from 'src/app/model/task';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from 'src/app/dialog/editTaskDialog/editTaskDialog.component';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {
  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  public dataSource!: MatTableDataSource<Task>; // контейнер - источник данных для таблицы

  @ViewChild(MatPaginator, { static: false }) private paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  @Output() addTask = new EventEmitter<Task>();
  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  @Output() selectCategory = new EventEmitter<Category | undefined>();

  @Output() filterByTitle = new EventEmitter<string>();
  @Output() filterByStatus = new EventEmitter<boolean | undefined>();
  @Output() filterByPriority = new EventEmitter<Priority | undefined>();

  public searchTaskText!: string;
  public selectedStatusFilter: boolean | undefined = undefined;
  public selectedPriorityFilter: Priority | undefined = undefined;

  public displayedColumns: string[] = [
    'color',
    'id',
    'title',
    'date',
    'priority',
    'category',
    'operations',
    'select',
  ];

  public priorities!: Priority[];
  public tasks!: Task[];

  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  @Input('priorities')
  public set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }
  @Input() selectedCategory!: Category | undefined;

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    this.dataSource = new MatTableDataSource();
    // this.fillTable();
    this.onSelectCategory(undefined);
  }

  toggleTaskCompleted(task: Task): void {
    task.completed = !task.completed;
  }

  // в зависимости от статуса задачи - вернуть цвет названия
  public getPriorityColor(task: Task): string {
    if (task.completed) {
      return '#F8F9FA';
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return '#fff';
  }

  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  private fillTable(): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.data = this.tasks; // обновить источник данных (т.к. данные массива tasks обновились)
    this.addTableObjects();

    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (task, colName) => {
      // по каким полям выполнять сортировку для каждого столбца
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
        case 'date': {
          return task.date ? task.date : null;
        }

        case 'title': {
          return task.title;
        }
      }
    };
  }

  private addTableObjects(): void {
    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
  }

  public openAddTaskDialog(): void {
    const task = new Task(0, '', false, undefined, this.selectedCategory);

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Добавление задачи'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }

  public openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Редактирование задачи'],
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'complete') {
        task.completed = true;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'activate') {
        task.completed = false;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }

  public openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${task.title}"`,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }

  public onToggleStatus(task: Task): void {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  public onSelectCategory(category: Category | undefined): void {
    this.selectCategory.emit(category);
  }

  public onFilterByTitle(): void {
    this.filterByTitle.emit(this.searchTaskText);
  }

  public onFilterByStatus(value: boolean | undefined): void {
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  public onFilterByPriority(priority: Priority | undefined): void {
    if (priority !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = priority;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }
}
