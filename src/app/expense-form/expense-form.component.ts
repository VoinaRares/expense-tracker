import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent {
  @Output() expenseAdded = new EventEmitter<{
    category: string;
    amount: number;
  }>();

  category: string = '';
  amount: number = 0;

  addExpense() {
    if (this.category && this.amount > 0) {
      this.expenseAdded.emit({ category: this.category, amount: this.amount });
      this.category = '';
      this.amount = 0;
    }
  }
}
