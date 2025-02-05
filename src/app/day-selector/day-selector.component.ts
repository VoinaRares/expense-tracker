import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Days } from '../shared/days.enum';

@Component({
  selector: 'app-day-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
})
export class DaySelectorComponent {
  days = Object.values(Days);
  @Input() currentDay!: string;
  @Output() daySelected = new EventEmitter<string>();

  selectDay(day: string) {
    this.daySelected.emit(day);
  }
}
