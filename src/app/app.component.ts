import { Component } from '@angular/core';
import { DaySelectorComponent } from './day-selector/day-selector.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { SummaryComponent } from './summary/summary.component';
import { Expense } from './shared/expense.interface';
import { ExpenseService } from './shared/expense.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DaySelectorComponent,
    ExpenseFormComponent,
    ExpenseListComponent,
    SummaryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(public expenseService: ExpenseService) {}

  selectDay(day: string) {
    this.expenseService.selectDay(day);
  }

  addExpense(expense: Expense) {
    this.expenseService.addExpense(expense);
  }

  deleteExpense(day: string, index: number) {
    this.expenseService.deleteExpense(day, index);
  }

  getDailyTotal(day: string) {
    return this.expenseService.getDailyTotal(day);
  }

  getWeeklySummary() {
    return this.expenseService.getWeeklySummary();
  }
}
