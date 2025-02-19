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
    try {
      this.loadExpensesFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize expenses:', error);
      this.expenses = {};
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          const urlSegments = event.urlAfterRedirects.split('/');
          const dayFromUrl = urlSegments[1];
          if (this.days.includes(dayFromUrl)) {
            this.currentDay = dayFromUrl;
          } else {
            console.warn(`Invalid day from URL: ${dayFromUrl}. Using current day: ${this.currentDay}`);
          }
        },
        error: (err) => console.error('Router event error:', err)
      });
  }

  private loadExpensesFromLocalStorage(): void {
    try {
      const storedExpenses = localStorage.getItem(this.storageKey);
      if (storedExpenses) {
        const parsed = JSON.parse(storedExpenses);

        if (this.isValidExpensesStructure(parsed)) {
          this.expenses = parsed;
        } else {
          console.error('Invalid expenses structure in localStorage. Resetting expenses.');
          localStorage.setItem(this.storageKey, "{}");
          this.expenses = {};
        }
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      throw new Error('Failed to load expenses from storage');
    }
  }

  private isValidExpensesStructure(data: Expense[]): boolean {
  return typeof data === 'object' && Object.keys(data).every((key) => {
    if (!this.days.includes(key)) {
      return false;
    }
    return true;
  });
  }


  private saveExpensesToLocalStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
      throw new Error('Failed to persist expenses to storage');
    }
  }

  selectDay(day: string) {
    if (!this.days.includes(day)) {
      throw new Error(`Invalid day selected: ${day}`);
    }
    this.currentDay = day;
  }

  addExpense(expense: Expense) {
    if (!this.days.includes(this.currentDay)) {
      throw new Error(`Cannot add expense to invalid day: ${this.currentDay}`);
    }

    try {
      if (!this.expenses[this.currentDay]) {
        this.expenses[this.currentDay] = [];
      }
      this.expenses[this.currentDay].push(expense);
      this.saveExpensesToLocalStorage();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw new Error('Failed to add expense');
    }
  }

  deleteExpense(day: string, index: number) {
    if (!this.days.includes(day)) {
      throw new Error(`Invalid day: ${day}`);
    }

    if (!this.expenses[day] || index < 0 || index >= this.expenses[day].length) {
      throw new Error(`Invalid expense index: ${index} for day ${day}`);
    }

    try {
      this.expenses[day].splice(index, 1);
      this.saveExpensesToLocalStorage();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }
  }

  getDailyTotal(day: string): number {
    if (!this.days.includes(day)) {
      console.warn(`Invalid day requested for total: ${day}`);
      return 0;
    }

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
