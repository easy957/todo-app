import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from './service/data-handler.service';
import { Category } from './model/category';
import { Task } from './model/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  tasks: Task[] = [];
  categories: Category[] = [];

  public selectedCategory!: Category | undefined;

  constructor(
    private dataHandler: DataHandlerService
  ) {
  }

  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  public onSelectCategory(category: Category | undefined): void {
    this.selectedCategory = category;

    this.dataHandler.searchTasks(
      this.selectedCategory,
      undefined,
      undefined,
      undefined
    ).subscribe(tasks => {
      this.tasks = tasks;
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
      this.onSelectCategory(this.selectedCategory);
    });
  }

  public onUpdateTask(task: Task): void {

    this.dataHandler.updateTask(task).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategory,
        undefined,
        undefined,
        undefined
      ).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }

  public onDeleteTask(task: Task): void {

    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategory,
        undefined,
        undefined,
        undefined
      ).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }

}
