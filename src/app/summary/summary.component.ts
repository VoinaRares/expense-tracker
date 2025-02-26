import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaySelectorComponent } from '../day-selector/day-selector.component';
import { ExpenseService } from '../shared/expense.service';
import { ExpensesByDay } from '../shared/expenses-by-day.interface';
import { DaySummaryComponent } from '../day-summary/day-summary.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, DaySelectorComponent, DaySummaryComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  constructor(public expenseService: ExpenseService) {}

  get summary(): ExpensesByDay {
    return this.expenseService.getWeeklySummary();
  }

  getSummaryKeys(): string[] {
    return Object.keys(this.summary);
  }

  calculateTotal(): number {
    return this.getSummaryKeys().reduce(
      (total, day) => total + this.summary[day],
      0
    );
  }
  clicked(){
    console.log("clicked");
  }
}
