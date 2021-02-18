import { DeviceDetectorService } from 'ngx-device-detector';
import { OperType } from './../OperType';
import { Category } from 'src/app/model/category';
import { DataHandlerService } from './../../service/data-handler.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Task } from 'src/app/model/task';
import { Priority } from 'src/app/model/priority';
import { ConfirmDialogComponent } from '../confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './editTaskDialog.component.html',
  styleUrls: ['./editTaskDialog.component.scss'],
})
export class EditTaskDialogComponent implements OnInit {
  public isMobile!: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, OperType],
    private dataHandler: DataHandlerService,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  public dialogTitle!: string;
  public task!: Task;
  public categories!: Category[];
  public priorities!: Priority[];

  public tmpTitle!: string;
  public tmpCategory!: Category;
  public tmpPriority!: Priority;
  public tmpDate!: Date | undefined;

  public operType!: OperType;

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];

    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category as Category;
    this.tmpPriority = this.task.priority as Priority;
    this.tmpDate = this.task.date;

    this.dataHandler
      .getAllCategories()
      .subscribe((items) => (this.categories = items));
    this.dataHandler
      .getAllPriorities()
      .subscribe((items) => (this.priorities = items));
  }

  public canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  public onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;

    this.dialogRef.close(this.task);
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }

  public delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу "${this.task.title}"?`,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }

  public complete(): void {
    this.dialogRef.close('complete');
  }

  public activate(): void {
    this.dialogRef.close('activate');
  }
}
