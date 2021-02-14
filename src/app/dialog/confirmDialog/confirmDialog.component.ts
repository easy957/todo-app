import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  public dialogTitle!: string;
  public message!: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {dialogTitle: string, message: string}
  ) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
   }

  ngOnInit(): void {
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
