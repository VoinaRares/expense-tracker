import { Component } from '@angular/core';
import { DaySelectorComponent } from './day-selector/day-selector.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { SummaryComponent } from './summary/summary.component';
import { Days } from './shared/days.enum';
import { Expense } from './shared/expense.interface';

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
  days: string[] =Object.values(Days);
  currentDay: string = this.days[0];
  expenses: { [day: string]: Expense[] } = {};

  selectDay(day: string) {
    this.currentDay = day;
  }

  addExpense(expense: Expense) {
    if (!this.expenses[this.currentDay]) {
      this.expenses[this.currentDay] = [];
    }
    this.expenses[this.currentDay].push(expense);
  }

  deleteExpense(day: string, index: number) {
    this.expenses[day].splice(index, 1);
  }

  getDailyTotal(day: string) {
    return (
      this.expenses[day]?.reduce(
        (total, expense) => total + expense.amount,
        0
      ) || 0
    );
  }

  getWeeklySummary() {
    return this.days.reduce((summary, day) => {
      summary[day] = this.getDailyTotal(day);
      return summary;
    }, {} as { [day: string]: number });
  }
}
