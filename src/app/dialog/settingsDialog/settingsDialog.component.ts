import { DataHandlerService } from './../../service/data-handler.service';
import { Priority } from 'src/app/model/priority';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settingsDialog.component.html',
  styleUrls: ['./settingsDialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  public priorities!: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dataHandler: DataHandlerService
  ) {}

  ngOnInit(): void {
    this.dataHandler
      .getAllPriorities()
      .subscribe((priorities) => (this.priorities = priorities));
  }

  public onClose(): void {
    this.dialogRef.close(false);
  }

  public onDeletePriority(priority: Priority): void {
    this.dataHandler.deletePriority(priority.id).subscribe();
  }

  public onUpdatePriority(priority: Priority): void {
    this.dataHandler.updatePriority(priority).subscribe();
  }

  public onAddPriority(priority: Priority): void {
    this.dataHandler.addPriority(priority).subscribe();
  }
}
