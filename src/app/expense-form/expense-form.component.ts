import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Expense } from '../shared/expense.interface';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent {
  @Output() expenseAdded = new EventEmitter<Expense>();
  category = '';
  amount = 0;

  addExpense(): void {
    if (this.category && this.amount > 0) {
      this.expenseAdded.emit({
        id: 0,
        category: this.category,
        amount: this.amount,
      });
      this.category = '';
      this.amount = 0;
    }
  }
}
