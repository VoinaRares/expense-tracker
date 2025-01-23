import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-day-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.css'],
})
export class DaySelectorComponent {
  @Input() days!: string[];
  @Input() currentDay!: string;
  @Output() daySelected = new EventEmitter<string>();

  selectDay(day: string) {
    this.daySelected.emit(day);
  }
}
