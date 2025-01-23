import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent {
  @Input() expenses!: { category: string; amount: number }[];
  @Output() expenseDeleted = new EventEmitter<number>();

  deleteExpense(index: number) {
    this.expenseDeleted.emit(index);
  }
}
