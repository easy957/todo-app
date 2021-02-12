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

  @Input()
  categories!: Category[];

  @Output()
  selectCategory = new EventEmitter();
  selectedCategory!: Category;

  constructor(private dataHandler: DataHandlerService) { }

  ngOnInit(): void {
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category): void {
    // this.selectedCategory = category;
    // this.dataHandler.fillTasksByCategory(category);

    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;

    this.selectCategory.emit(this.selectedCategory);
  }

}
