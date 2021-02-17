import { DeviceDetectorService } from 'ngx-device-detector';
import { OperType } from './../../dialog/OperType';
import { EditCategoryDialogComponent } from './../../dialog/editCategoryDialog/editCategoryDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { Category } from './../../model/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  public indexMouseMove!: number | null;
  public searchCategoryTitle!: string;
  public selectedCategoryMap!: Map<Category, number>;

  public isMobile!: boolean;

  @Input() categories!: Category[];

  @Output() selectCategory = new EventEmitter<Category | undefined>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() updateCategory = new EventEmitter<Category>();
  @Output() addCategory = new EventEmitter<Category>();
  @Output() searchCategory = new EventEmitter<string>();

  @Input() selectedCategory!: Category | undefined;
  @Input('categoryMap') set setCategoryMap(categoryMap: Map<Category, number>) {
    this.selectedCategoryMap = categoryMap;
  }
  @Input() uncompletedTotal!: number;

  constructor(
    private dialog: MatDialog,
    private deviceDetector: DeviceDetectorService
  ) {
    this.isMobile = this.deviceDetector.isMobile();
  }

  showTasksByCategory(category: Category | undefined): void {
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;

    this.selectCategory.emit(this.selectedCategory);
  }

  public showEditIcon(index: number | null): void {
    this.indexMouseMove = index;
  }

  public openAddCategoryDialog(): void {
    const category = new Category(0, '');
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавить новую категорию', OperType.ADD],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
        category.title = result as string;
        this.addCategory.emit(category);
        return;
      }
    });
  }

  public openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.deleteCategory.emit(category);
        return;
      } else if (typeof result === 'string') {
        category.title = result as string;
        this.updateCategory.emit(category);
        return;
      }
    });
  }

  public search(): void {
    if (this.searchCategoryTitle == null) {
      return;
    }

    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
