import { Component } from '@angular/core';
import { DaySelectorComponent } from '../day-selector/day-selector.component';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseService } from '../shared/expense.service';

@Component({
  selector: 'app-day-expense',
  standalone: true,
  imports: [DaySelectorComponent, ExpenseFormComponent, ExpenseListComponent],
  templateUrl: './day-expense.component.html',
  styleUrl: './day-expense.component.scss',
})
export class DayExpenseComponent {
  constructor(public expenseService: ExpenseService) {}
}
