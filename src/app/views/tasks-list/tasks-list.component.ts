import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';
import {Task} from 'src/app/model/task';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from 'src/app/dialog/editTaskDialog/editTaskDialog.component';

@Component({
    selector: 'app-tasks-list',
    templateUrl: './tasks-list.component.html',
    styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, AfterViewInit {

  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  public dataSource!: MatTableDataSource<Task>; // контейнер - источник данных для таблицы

  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  public tasks!: Task[];

  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  @Output()
  updateTask = new EventEmitter<Task>();

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);

    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    this.dataSource = new MatTableDataSource();

    this.fillTable();
  }

// в этом методе уже все проинциализировано, поэтому можно присваивать объекты (иначе может быть ошибка undefined)
  ngAfterViewInit(): void {
    this.addTableObjects();
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

  public openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(
      EditTaskDialogComponent,
      {
        data: [task, 'Редактирование задачи'],
        autoFocus: false
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }
}
