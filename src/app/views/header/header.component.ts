import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() public categoryName!: string;
  @Input() public statShown!: boolean;

  @Output() public toggleStat = new EventEmitter<boolean>();

  public onToggleStat(): void {
    this.toggleStat.emit(!this.statShown);
  }

  constructor() {}
}
