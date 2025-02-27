import { Component, Input } from '@angular/core';
import { ExpenseService } from '../../shared/expense.service';
import { Expense } from '../../shared/expense.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-day-summary-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-summary-detail.component.html',
  styleUrl: './day-summary-detail.component.css'
})
export class DaySummaryDetailComponent {
  dailyExpenses: Expense[] = [];
  @Input({ required: true }) day!: string;

  constructor(public expenseService: ExpenseService) {
    this.expenseService.expenses$.subscribe({
      next: () => {
        this.dailyExpenses = expenseService.getExpensesForDay(this.day);
      }});
  }

  ngOnInit() {
    this.dailyExpenses = this.expenseService.getExpensesForDay(this.day);
    console.log(this.dailyExpenses);
  }
}
