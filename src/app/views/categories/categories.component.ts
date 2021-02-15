import { EditCategoryDialogComponent } from './../../dialog/editCategoryDialog/editCategoryDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { Category } from './../../model/category';
import { DataHandlerService } from './../../service/data-handler.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public indexMouseMove!: number | null;


  @Input() categories!: Category[];

  @Output() selectCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() updateCategory = new EventEmitter<Category>();

  @Input() selectedCategory!: Category | undefined;

  constructor(
    private dialog: MatDialog,
    private dataHandler: DataHandlerService) { }

  ngOnInit(): void {
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category | undefined): void {
    // this.selectedCategory = category;
    // this.dataHandler.fillTasksByCategory(category);

    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;

    this.selectCategory.emit(this.selectedCategory);
  }

  public showEditIcon(index: number | null): void {
    this.indexMouseMove = index;
  }

  public openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории'],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'delete') {
        this.deleteCategory.emit(category);
        return;

      } else if (typeof (result) === 'string') {
        category.title = result as string;
        this.updateCategory.emit(category);
        return;
      }

    });

  }

}
