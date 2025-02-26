import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../shared/expense.interface';
import { ExpenseService } from '../shared/expense.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent {
  @Output() expenseDeleted = new EventEmitter<number>();
  expenses: Expense[] = [];
  currentDay: string = '';

  constructor(private expenseService: ExpenseService) {
    expenseService.currentDay$.subscribe({
      next: (day) => {
        this.currentDay = day;
        this.expenses = this.expenseService.getExpensesForDay(this.currentDay);
      }
    });
    this.expenseService.expenses$.subscribe({
      next: () => {
        this.expenses = this.expenseService.getExpensesForDay(this.currentDay);
      },
    });
  }

  deleteExpense(index: number) {
    this.expenseService.deleteExpense(this.expenseService.getCurrentDaySubject(), index);
    this.expenseDeleted.emit(index);
  }
}
