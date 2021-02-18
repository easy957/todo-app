import { DeviceDetectorService } from 'ngx-device-detector';
import { transition } from '@angular/animations';
import { ConfirmDialogComponent } from './../../dialog/confirmDialog/confirmDialog.component';
import { OperType } from './../../dialog/OperType';
import { EditCategoryDialogComponent } from './../../dialog/editCategoryDialog/editCategoryDialog.component';
import { Priority } from 'src/app/model/priority';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.scss'],
})
export class PrioritiesComponent {
  private defaultColor = '#fff';

  @Input() priorities!: Priority[];

  @Output() deletePriority = new EventEmitter<Priority>();
  @Output() updatePriority = new EventEmitter<Priority>();
  @Output() addPriority = new EventEmitter<Priority>();

  public isMobile!: boolean;

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  public openEditPriorityDialog(priority: Priority): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [priority.title, 'Редактирование приоритета', OperType.EDIT],
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.deletePriority.emit(priority);
        return;
      } else if (typeof result === 'string') {
        priority.title = result as string;
        this.updatePriority.emit(priority);
        return;
      }
    });
  }

  public openDeletePriorityDialog(priority: Priority): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить приоритет: "${priority.title}" ?`,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePriority.emit(priority);
      }
    });
  }

  public openAddPriorityDialog(): void {
    const priority = new Priority(0, '', this.defaultColor);
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавить новый приоритет', OperType.ADD],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        priority.title = result as string;
        this.addPriority.emit(priority);
      }
    });
  }
}
