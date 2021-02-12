import { DataHandlerService } from './../../service/data-handler.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Task } from 'src/app/model/task';


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
  public tmpTitle!: string;



  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.tmpTitle = this.task.title;
  }

  public onConfirm(): void {
    this.task.title = this.tmpTitle;

    this.dialogRef.close(this.task);
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }

}
