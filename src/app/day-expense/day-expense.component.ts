import { Component } from '@angular/core';
import { DaySelectorComponent } from '../day-selector/day-selector.component';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseService } from '../shared/expense.service';
import { Expense } from '../shared/expense.interface';

@Component({
  selector: 'app-day-expense',
  standalone: true,
  imports: [DaySelectorComponent, ExpenseFormComponent, ExpenseListComponent],
  templateUrl: './day-expense.component.html',
  styleUrl: './day-expense.component.scss',
})
export class DayExpenseComponent {
  currentDay: string = '';
  expenses: Expense[] = [];

  constructor(public expenseService: ExpenseService) {
    expenseService.currentDay$.subscribe({
      next: (day) => {
        this.currentDay = day;
        this.updateExpenses();
      }
    });

    expenseService.expenses$.subscribe({
      next: () => {
        this.updateExpenses();
      }
    });
  }

  private updateExpenses() {
    this.expenses = this.expenseService.getExpensesForDay(this.currentDay);
  }
}
