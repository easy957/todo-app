import { Category } from 'src/app/model/category';
import { DataHandlerService } from './../../service/data-handler.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Task } from 'src/app/model/task';
import { Priority } from 'src/app/model/priority';


@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './editTaskDialog.component.html',
  styleUrls: ['./editTaskDialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string],
    private dataHandler: DataHandlerService,
    private dialog: MatDialog
  ) { }

  public dialogTitle!: string;
  public task!: Task;
  public categories!: Category[];
  public priorities!: Priority[];

  public tmpTitle!: string;
  public tmpCategory!: (Category | undefined);
  public tmpPriority!: (Priority | undefined);



  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];

    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;

    this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
    this.dataHandler.getAllPriorities().subscribe(items => this.priorities = items);
  }

  public onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;

    this.dialogRef.close(this.task);
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }

}
