import { Component, OnInit } from '@angular/core';

import { Task } from 'src/app/model/task';
import { DataHandlerService } from './../../service/data-handler.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private dataHandler: DataHandlerService) { }

  ngOnInit() {
    this.tasks = this.dataHandler.getTasks();
  }

}
