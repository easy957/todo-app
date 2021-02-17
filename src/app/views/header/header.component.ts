import { IntroService } from './../../service/intro.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from 'src/app/dialog/settingsDialog/settingsDialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() public categoryName!: string;
  @Input() public statShown!: boolean;

  @Output() public toggleStat = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog, private introService: IntroService) {}

  public onToggleStat(): void {
    this.toggleStat.emit(!this.statShown);
  }

  public onShowIntro(): void {
    this.introService.startIntroJS(false);
  }

  public showSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      autoFocus: false,
      width: '500px',
    });
  }
}
