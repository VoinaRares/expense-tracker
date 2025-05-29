import { Component } from '@angular/core';
import { DaySelectorComponent } from '../day-selector/day-selector.component';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseService } from '../shared/expense.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expense } from '../shared/expense.interface';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-day-expense',
  standalone: true,
  imports: [
    CommonModule,
    DaySelectorComponent,
    ExpenseFormComponent,
    ExpenseListComponent,
    SidebarModule,
  ],
  templateUrl: './day-expense.component.html',
  styleUrls: ['./day-expense.component.scss'],
})
export class DayExpenseComponent {
  currentDay = '';
  expenses: Expense[] = [];
  rightMenuVisible = false;

  constructor(
    public expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.expenseService.currentDay$.subscribe({
      next: (day) => {
        this.currentDay = day;
        this.updateExpenses();
      },
    });
    this.expenseService.expenses$.subscribe({
      next: () => {
        this.updateExpenses();
      },
    });
  }

  private updateExpenses(): void {
    this.expenses = this.expenseService.getExpensesForDay(this.currentDay);
  }

  logout(): void {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
