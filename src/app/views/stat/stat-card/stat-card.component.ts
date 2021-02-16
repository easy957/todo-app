import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {

  @Input() completed = false;
  @Input() iconName!: string;
  @Input() count1: any;
  @Input() countTotal: any;
  @Input() title!: string;

  constructor() { }
}
