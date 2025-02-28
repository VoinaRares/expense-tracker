import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../shared/expense.interface';
import { ExpenseService } from '../shared/expense.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent {
  @Output() expenseDeleted = new EventEmitter<number>();
  expenses: Expense[] = [];
  currentDay: string = '';
  editingExpense: Expense | null = null;

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
    let savedIndex = this.expenses[index].id;
    this.expenseService.deleteExpense(this.expenseService.getCurrentDaySubject(), savedIndex);
  }
  editExpense(index: number) {
    this.editingExpense = {...this.expenses[index]};
  }

  saveExpense(){
    if (this.editingExpense) {
      const index = this.expenses.findIndex(exp => exp.id === this.editingExpense!.id);
      if (index !== -1) {
        this.expenseService.editExpense(this.editingExpense);
        this.editingExpense = null;
      }
    }
  }

  cancelEdit() {
    this.editingExpense = null;
  }

}
