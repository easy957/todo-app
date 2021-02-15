import { ConfirmDialogComponent } from './../confirmDialog/confirmDialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ValueProvider } from '@angular/core';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './editCategoryDialog.component.html',
  styleUrls: ['./editCategoryDialog.component.scss']
})
export class EditCategoryDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string, string],
    private dialog: MatDialog
  ) { }

  public dialogTitle!: string;
  public categoryTitle!: string;
  // public canDelete = true;

  ngOnInit(): void {
    this.categoryTitle = this.data[0];
    this.dialogTitle = this.data[1];

    // if (!this.categoryTitle) {
    //   this.canDelete = false;
    // }
  }

  public onConfirm(): void {
    this.dialogRef.close(this.categoryTitle);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить категорию "${this.categoryTitle}"?`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }

}
