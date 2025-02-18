import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Days } from '../shared/days.enum';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-day-selector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
})
export class DaySelectorComponent {
  days = Object.values(Days);

  constructor(private router: Router) {}

  private navigableDays = Object.values(Days).filter(
    (day) => day !== Days.Total
  );

  @Input() currentDay!: string;
  @Output() daySelected = new EventEmitter<string>();

  selectDay(day: string) {
    this.daySelected.emit(day);
  }

  goToPrevious() {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex =
      (currentIndex - 1 + this.navigableDays.length) %
      this.navigableDays.length;
    this.selectDay(this.navigableDays[newIndex]);

    this.router.navigate([this.navigableDays[newIndex]]);
  }

  goToNext() {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex = (currentIndex + 1) % this.navigableDays.length;
    this.selectDay(this.navigableDays[newIndex]);

    this.router.navigate([this.navigableDays[newIndex]]);
  }


}
