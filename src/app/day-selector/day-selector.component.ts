import { Component } from '@angular/core';
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
  currentDay = 'Monday';
  private navigableDays = Object.values(Days).filter((day) => day !== Days.Total);

  constructor(private router: Router, public expenseService: ExpenseService) {
    this.expenseService.currentDay$.subscribe({
      next: (day) => {
        this.currentDay = day;
      },
    });
  }

  goToPrevious(): void {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex =
      (currentIndex - 1 + this.navigableDays.length) % this.navigableDays.length;
    this.router.navigate([this.navigableDays[newIndex]]);
  }

  goToNext(): void {
    const currentIndex = this.navigableDays.indexOf(
      this.currentDay as Exclude<Days, Days.Total>
    );
    const newIndex = (currentIndex + 1) % this.navigableDays.length;
    this.router.navigate([this.navigableDays[newIndex]]);
  }
}
