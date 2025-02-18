import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Expense } from './expense.interface';
import { Days } from './days.enum';
import { ExpensesByDay } from './expenses-by-day.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  days: string[] = Object.values(Days);
  currentDay: string = this.days[0];
  expenses: { [day: string]: Expense[] } = {};
  private storageKey = 'expenses';

  constructor(private router: Router) {
    this.loadExpensesFromLocalStorage();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlSegments = event.urlAfterRedirects.split('/');
        const dayFromUrl = urlSegments[1];
        if (this.days.includes(dayFromUrl)) {
          this.currentDay = dayFromUrl;
        }
      });
  }

  private loadExpensesFromLocalStorage(): void {
    const storedExpenses = localStorage.getItem(this.storageKey);
    if (storedExpenses) {
      this.expenses = JSON.parse(storedExpenses);
    }
  }

  private saveExpensesToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.expenses));
  }

  selectDay(day: string) {
    this.currentDay = day;
  }

  addExpense(expense: Expense) {
    if (!this.expenses[this.currentDay]) {
      this.expenses[this.currentDay] = [];
    }
    this.expenses[this.currentDay].push(expense);
    this.saveExpensesToLocalStorage();
  }

  deleteExpense(day: string, index: number) {
    if (this.expenses[day]) {
      this.expenses[day].splice(index, 1);
      this.saveExpensesToLocalStorage();
    }
  }

  getDailyTotal(day: string): number {
    return (
      this.expenses[day]?.reduce(
        (total, expense) => total + expense.amount,
        0
      ) || 0
    );
  }

  getWeeklySummary(): ExpensesByDay {
    return this.days.reduce((summary, day) => {
      summary[day] = this.getDailyTotal(day);
      return summary;
    }, {} as ExpensesByDay);
  }
}
