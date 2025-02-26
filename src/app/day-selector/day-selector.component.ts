import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Days } from '../shared/days.enum';
import { RouterModule, Router } from '@angular/router';
import { ExpenseService } from '../shared/expense.service';

@Component({
  selector: 'app-day-selector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
})
export class DaySelectorComponent {
  days = Object.values(Days);
  currentDay: string = 'Monday';

  constructor(private router: Router, public expenseService: ExpenseService) {
    expenseService.currentDay$.subscribe({
      next: (day) => {
        this.currentDay = day;
      },
    });
  }

  private navigableDays = Object.values(Days).filter(
    (day) => day !== Days.Total
  );

  goToPrevious() {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex =
      (currentIndex - 1 + this.navigableDays.length) %
      this.navigableDays.length;

    this.router.navigate([this.navigableDays[newIndex]]);
  }

  goToNext() {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex = (currentIndex + 1) % this.navigableDays.length;

    this.router.navigate([this.navigableDays[newIndex]]);
  }
}
