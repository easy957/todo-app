import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.3s ease-out', style({ height: 188, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 188, opacity: 1 }),
        animate('.3s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class StatComponent {
  @Input() totalTasksInCategory!: number;
  @Input() completeTasksInCategory!: number;
  @Input() uncompleteTasksInCategory!: number;
  @Input() statShown!: boolean;

  constructor() {}
}
