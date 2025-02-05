import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../shared/expense.interface';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent {
  @Input() expenses!: Expense[];
  @Output() expenseDeleted = new EventEmitter<number>();

  deleteExpense(index: number) {
    this.expenseDeleted.emit(index);
  }
}
